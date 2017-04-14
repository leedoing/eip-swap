# eip-swap

```
#Make Custom Policy
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Stmt1491964068000",
            "Effect": "Allow",
            "Action": [
                "ec2:AssociateAddress",
                "ec2:DescribeAddresses"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```
#Make Lambda Role
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

##Config
```json
{
        "eip" : "13.124.48.32", //Elastic IP
        "port" : "8080", //Check TCP Port
        "ec2Ids" : ["i-0a62787523bb4cdf1", //EC2 Instance IDs
                    "i-0e57c7b10e4137a6d"],
        "threshold" : 3
}

```

##Upload Zip file to Lambda
