# 101 Serverless Framework workshop

This repository contains the full code and material for the 101 [Serverless Framework](https://serverless.com) prepared by the [author](#author).

The intention of this workshop is to introduce you to the Serverless Framework over AWS using several small web projects that covers the most common capabilities of the framework to develop web applications.

The index of the workshop is the following:

*  What is serverless?
*  What is serverless framework?
*  Core concepts
*  The serverless yaml
*  CLI
*  Installation and credentials
*  Hands on

The main topic of the workshop is to practice with the framework over the small projects, but we have to do a fast review of core theorical concepts involved in this workshop.

## What is serverless?

There are multiple serverless concept definitions, but we can summarize them with the following:

*  “Serverless is a state of mind” - _Ben Kehoe_
*  Not worry about the underlying infraestructure, focus on business value delivery.
*  “Real” pay per use

Because we are working over AWS, we have to keep an eye on the main services used in the workshop:

*  **S3**. Storages and serve client application code.
*  **Cognito**. Generate temporary AWS credentials.
*  **API Gateway**. Host the API and route API calls.
*  **Lambda**. Execute our app's business logic.
*  **DynamoDB**. Data storage.

Here is the basic diagram:

<div align="center" alt="serverless basic web application diagram">
    <img src="https://files.juanmanuelruizfernandez.com/images/AWS Serverless Web App Hosting-2.png" />
</div>

## What is Serverless Framework?

Serverless Framework is a **user-friendly** and cloud provider agnostic framework for serverless model applications development.

## Core concepts

We will work with serverless, so we have to learn a bit of how it works.

### Functions

Functions are the objects that will contains our business logic code. Here appears the concept of FaaS, _Function As A Service_. We have to consider two main aspects of our functions as input parameters:

*  Event
*  Context

In our case, functions will be deployed and executed over [AWS Lambda](https://aws.amazon.com/lambda/?nc1=h_ls) service.

### Events

Most of the serverless architectures are Event Driven Architectures, so the second core concept of Serverless Framework are the **events**.

Events will be defined in multiple AWS services such as:
*  API Gateway (http events)
*  S3 (S3 API events)
*  Cloudwatch (Metrics, scheduled and other API based triggers)
*  ...etc.

Each function may have at least one trigger event that fires the function.

### Resources

Resources refers to infrastructure elements. We can define our custom resources.

Serverless Framework, will let you focus on code, because the most common resources are automatically managed by the framework and offers a simpliest and user-friendly interface for them.

### Services

Services are projects in serverless framework. Services **are not applications**, only a definition of a software part that we have in our project, thus, an application may contains several services accoding to the business core functionalities, or application model, or data flow design, for example.

## The serverless yaml

Is the main object in Serverless Framework to define the configuration of our services.

Here is full an example with the most used elements:

```yaml
# Welcome to Serverless!
#
# This file is the main config file for your service.
# It's very minimal at this point and uses default values.
# You can always add more config options for more control.
# We've included some commented out config examples here.
# Just uncomment any of them to get that config option.
#
# For full config options, check the docs:
#    docs.serverless.com
#
# Happy Coding!

service: test
#app: your-app-name
#tenant: your-tenant-name

# You can pin your service to only deploy with a specific Serverless version
# Check out our docs for more details
frameworkVersion: "=X.X.X"

provider:
  name: aws
  runtime: python3.7

# you can overwrite defaults here
  stage: dev
  region: us-east-1

# you can add statements to the Lambda function's IAM Role here
  iamRoleStatements:
    - Effect: "Allow"
      Action:
        - "s3:ListBucket"
      Resource: { "Fn::Join" : ["", ["arn:aws:s3:::", { "Ref" : "ServerlessDeploymentBucket" } ] ]  }
    - Effect: "Allow"
      Action:
        - "s3:PutObject"
      Resource:
        Fn::Join:
          - ""
          - - "arn:aws:s3:::"
            - "Ref" : "ServerlessDeploymentBucket"
            - "/*"
  # you can define service wide environment variables here
  environment:
    variable1: value1
  tags:
    serviceName: sls-lego-catalog-back
    language: python
  logs:
    restApi: # Optional configuration which specifies if API Gateway logs are used. This can either be set to true to use defaults, or configured via subproperties.
      accessLogging: true

# Custom defined constant variables
custom:
  cognitoUserPoolARN: arn:aws:cognito-idp:${ self:provider.region }:#{ AWS::AccountId }:userpool/eu-west-1_nteEJTM4E

plugins:
  - serverless-pseudo-parameters
  - serverless-python-requirements
  - serverless-offline

# you can add packaging information here
package:
  include:
    - include-me.py
    - include-me-dir/**
  exclude:
    - exclude-me.py
    - exclude-me-dir/**
  individually: true

functions:
  hello:
    handler: handler.hello
    memorySize: 512 # memorySize for this specific function.
    timeout: 10 # Timeout for this specific function.  Overrides the default set above.
    tags: # Function specific tags
      foo: bar
#    The following are a few example events you can configure
#    NOTE: Please make sure to change your handler code to work with those events
#    Check the event documentation for details
    events:
      - http:
          path: users/create
          method: get
          cors: true 
          authorizer:
            arn: ${ self:custom.cognitoUserPoolARN }
          response:
            headers:
              Content-Type: integration.response.header.Content-Type
              Cache-Control: "'max-age=120'"
#      - websocket: $connect
      - s3: ${env:BUCKET}
      - schedule: rate(10 minutes)
      - sns: greeter-topic
      - sqs:
        arn: arn:aws:sqs:region:XXXXXX:myQueue
        batchSize: 10
      - stream: arn:aws:dynamodb:region:XXXXXX:table/foo/stream/1970-01-01T00:00:00.000
#      - alexaSkill: amzn1.ask.skill.xx-xx-xx-xx
#      - alexaSmartHome: amzn1.ask.skill.xx-xx-xx-xx
#      - iot:
#          sql: "SELECT * FROM 'some_topic'"
      - cloudwatchEvent:
          event:
            source:
              - "aws.ec2"
            detail-type:
              - "EC2 Instance State-change Notification"
            detail:
              state:
                - pending
      - cloudwatchLog: '/aws/lambda/hello'
#      - cognitoUserPool:
#          pool: MyUserPool
#          trigger: PreSignUp
#      - alb:
#          listenerArn: arn:aws:elasticloadbalancing:us-east-1:XXXXXX:listener/app/my-load-balancer/50dc6c495c0c9188/
#          priority: 1
#          conditions:
#            host: example.com
#            path: /hello

#    Define function environment variables here
    environment:
      variable2: value2

# you can add CloudFormation resource templates here
resources:
  Resources:
    NewResource:
      Type: AWS::S3::Bucket
      Properties:
        BucketName: my-new-bucket
  Outputs:
      NewOutput:
        Description: "Description for the output"
        Value: "Some output value"

```

## CLI

Serverless framework have a very powerful CLI (Command Line Interface) tool, that will let us do the most operations over our services.

You can execute the cli simply typing in your terminal:

```bash
serverless --version
```

Consider the use of the shorter version. You will receive an output similar to this one:

```bash
➜ sls --version
Framework Core: 1.51.0
Plugin: 1.3.10
SDK: 2.1.0
```

Here are the most relevant commands:
*  **create**. This let you create a new service. You have to use a template to create a service according to your needs.
*  **package**. Packages the service or an specific function following the packaging strategy. By default, all service will be packaged in a simgle .zip file.
*  **deploy**. Deploys the serviceon your infraestructure.
*  **metrics**. This will give you usage metrics of your service over the last 24 hours.
*  **logs**. Brings the log files from the invocation of the functions in your service to your terminal.
*  **invoke**. Let you invoke a deployed function of your service from your terminal.
*  **invoke-local**. Let you locally invoke a function of your service.
*  **info**. This gives you a summary of information about your deployed service.
*  **rollback**. This let you rollback a deployment over time.
*  **print**. This action prints in your terminal the interpolations translated serverless yaml.

## Installation and credentials

Once we have nodejs and npm in our system, installation of Serverless Framework is trivial:

```bash
npm install serverless
```

As a requirement for this workshop we must own an AWS account and/or have administration access to one.

In order to use the AWS account, we have to set our credentials in our machine. If we don't have an IAM user for your account, please refer to this official documentation guide: [Setting up an iam user](https://docs.aws.amazon.com/es_es/mediapackage/latest/ug/setting-up-create-iam-user.html).

Once we have an user with API credentials, we can choose several ways to configure our credentials in our machine. I recommend the use of AWS profiles: [AWS Profiles guide](https://docs.aws.amazon.com/es_es/cli/latest/userguide/cli-configure-profiles.html).

## Hands on

We have to work in an initial hello worl project to check that we can use the CLI, understand the serverless yaml file, and make our first deployment.

### Hello world

First of all, we are going to inspect what kind o services we can create from Serverless Framework:

```bash
sls create -t --help
```

#### Create service

Now, we are going to create a new service from the CLI. As this is a hello world application, we prefer to use an interpretated language, like javascript, so:

```bash
sls create -t aws-nodejs -n hello-world
```

This will create a minimal expression service that only contains our `serverless.yaml` and a `handler.js` file which contains the javascript code for our hello-world function.

#### Invoke locally

Now we are going to test it locally:

```bash
sls invoke local -f hello
```

Then, we will get the hello-world response:

```bash
➜ sls invoke local -f hello
{
    "statusCode": 200,
    "body": "{\n  \"message\": \"Go Serverless v1.0! Your function executed successfully!\",\n  \"input\": \"\"\n}"
}
```

#### Deploy

Now, we are going to deploy our service. If we have set our AWS profile, we can do the following:

```bash
sls deploy --stage dev --aws-profile PROFILE_NAME
```

As you can see, we have specified the stage that we will deploy and the AWS profile.

#### Invoke remotely

After a few seconds later, our service stack is been deployed, so we can already use it.

We are going to invoke our hello function remotely:

```bash
sls invoke -f hello --aws-profile PROFILE_NAME
```

If everthing was fine, we will receive the same hello world response:

```bash
➜ sls invoke --stage dev -f hello --aws-profile PROFILE_NAME
{
    "statusCode": 200,
    "body": "{\n  \"message\": \"Go Serverless v1.0! Your function executed successfully!\",\n  \"input\": {}\n}"
}
```

### Big mouth

Once we have complete this first approach to the Serverless Framework, we are going to work in a prepared fullstack web project called **Big Mouth**.

We can start following this link: [Big Mouth Project](./big-mouth/step-1/step-1.md)

### Other advanced projects

You can find two more projects inside this repository with the same AWS services use, but with more advanced aspects developed.

#### Big meme

Big meme is a "copy" of Big mouth developed in python with a structure of classes and functions similar to traditional web project with the MVC pattern.

#### Lego Catalog

Lego Catalog is more advanced concept of a serverless project with a separated frontend application created in angular and where some AWS infraestructure resources such as DynamoDB are defined out of the service stack using terraform.

You can also see some more fine grained details in the serverless configuration such as individually packaging of functions.

## References

Here are some related and interesting references used in this workshop:

*  https://read.acloud.guru/serverless-is-a-state-of-mind-717ef2088b42
*  https://serverless.com/framework/docs/providers/aws/
*  https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/
*  https://github.com/neovasili/101_serverless_workshop
*  https://www.datree.io/resources/serverless-best-practices

---

## Author

Juan Manuel Ruiz Fernández

*  Twitter: [@NeoVasili](https://twitter.com/NeoVasili)
*  Github: [@neovasili](https://github.com/neovasili)
*  Blog: [thebrickcode.com](https://thebrickcode.com)