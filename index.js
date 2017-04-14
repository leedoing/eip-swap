'use strict'
var AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2'
var ec2 = new AWS.EC2();
var tcpp = require('tcp-ping');
var waterfall = require('async-waterfall');
var CronJob = require('cron').CronJob;
var sleep = require('system-sleep');
var async = require('async');
var config = require('./config/config.json');

const ec2Describe = (eip, callback) => {
        const params = {
        }
        ec2.describeAddresses(params, function(err, data){
                if(err) console.log(err, err.stack);
                else{
                        for(var i = 0;  i < data.Addresses.length; i++){
                                if(data.Addresses[i].PublicIp == eip){
                                                callback(data.Addresses[i]);
                                }
                        }
                }
        });
}

const tcpChecker = (eip, port, callback) => {
        tcpp.probe(eip, port, function(err, result){
                callback(result);
        });
}

const ec2AssociateAddress = (allId, ec2Ids, ec2Id) => {
        var ec2TargetId = '';
        (ec2Id == ec2Ids[0]) ? ec2TargetId = ec2Ids[1] : ec2TargetId = ec2Ids[0]
        var params = {
                AllocationId: allId,
                InstanceId: ec2TargetId
        }
        ec2.associateAddress(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
                });
}

exports.handler = (event, context, callback) => {
waterfall(
	 [
                function(callback){
                        const ec2info = config;
                        callback(null, ec2info);
                },
                function(ec2info, callback){
                        var tcpCheckNum = 0;
                        for(var i=0; i < ec2info.threshold; i++){
                                tcpChecker(ec2info.eip, ec2info.port, function(result){;
                                        result ? null : tcpCheckNum++;
                                });
                                sleep(10000); //tcp module default timeout 5s, sleep time > 5s
                        }
                        console.log(tcpCheckNum);
                        (tcpCheckNum == ec2info.threshold ) ? callback(null, ec2info) : callback(null);
                },
                function(ec2info, callback){
                        ec2Describe(ec2info.eip, function(data){
                                callback(null, ec2info, data);
                        });
                },
                function(ec2info, ec2Address, callback){
                        ec2AssociateAddress(ec2Address.AllocationId, ec2info.ec2Ids, ec2Address.InstanceId);
                        callback(null, 'done');
                }
        ], function(err, result){
                if(err) console.log(err);
                else console.log(result);
        }
)
	callback(null, "Success");
};
