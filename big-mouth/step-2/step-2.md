# Step 2

In this step, we are going to add DynamoDB support to our application. So we have to do the following things:

*  Create an appropiate IAM role to give AWS lambda permissions to operate over DynamoDB.
*  Create a new function that reads contents from DynamoDB.
*  Give more permissions to AWS lambda to let the `get-index` functions invoke the new funtion.
*  Create a few custom variables that will help us define other configurations.
*  Add a few environment variables to our functions.
*  Create the DynamoDB table where we will store the restaurants data.
*  Populate the DynamoDB table with some data.

## IAM role

We have to add an IAM role to give our functions permissions enough to operate over AWS services.

Serverless Framework let you define a global IAM role for every function you define in your service.

So in the provider section of our serverless yaml file we are going to add the following section:

```yaml
iamRoleStatements:
  - Effect: Allow
    Action: dynamodb:scan
    Resource: arn:aws:dynamodb:#{ AWS::Region }:#{ AWS::AccountId }:table/${ self:service }-${ self:provider.stage }-restaurants
  - Effect: Allow
    Action: execute-api:Invoke
    Resource: arn:aws:execute-api:#{ AWS::Region }:#{ AWS::AccountId }:*/*/GET/restaurants
```

Take into account that indentation is critical in yaml files, so ensure you put it in the correct level, just nested in the provider section.

This role allow functions to perform `dynamodb:scan` over an specific DynamoDB table, that we will call `big-mouth-dev-restaurants`. To make it more scalable, we are going to define several things interpolating whenever is possible.

The second sentence, allows functions to invoke a lambda function through its linked API Gateway http event GET to `/restaurants` path.

## DynamoDB

For DynamoDB we need, first of all, create the AWS resource, so we are going to define it.

Serverless Framework operates over AWS Cloudformation service defining Infrastructure As Code in yaml files, so you can add Cloudformation resources to your service.

In this case, we are going to put this definition into a separated file `resources/infraestructure/dynamodb.yml` with the following content:

```yaml
Resources:
  restaurantsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: ${ self:custom.restaurantsTable }
      AttributeDefinitions:
        - AttributeName: name
          AttributeType: S
      KeySchema:
        - AttributeName: name
          KeyType: HASH
      ProvisionedThroughput:
        ReadCapacityUnits: 1
        WriteCapacityUnits: 1
```

Now, we have to let serverless know, where is this additional resource definition located, so we need to add a few extra lines to our serverless yaml file:

```yaml
resources:
  - ${ file( resources/infrastructure/dynamodb.yml ) }
```

This resources section must to be at the root level of the serverless yaml file.

## Get restaurants function

We are going to add a `functions/get-restaurants.js` file that will retrieve restaurants data from DynamoDB with the following code:

```javascript
'use strict';

const co = require( "co" );
const AWS = require( "aws-sdk" )
const dynamodb = new AWS.DynamoDB.DocumentClient()

const defaultResults = process.env.defaultResults || 8;
const tableName = process.env.restaurants_table;

function* getRestaurants( count ) {
    let request = {
        TableName: tableName,
        Limit: count
    };

    let response = yield dynamodb.scan( request ).promise();

    return response.Items;
}

module.exports.handler = co.wrap( function* ( event, context, callback ) {
  
    let restaurants = yield getRestaurants( defaultResults );

    const response = {
        statusCode: 200,
        body: JSON.stringify( restaurants )
    };

    callback( null, response );
} ) ;
```

We also need to add a new function in the serverless yaml file with a new path in our api inside the functions section of the yaml:

```yaml
get-restaurants:
  handler: functions/get-restaurants.handler
  events:
    - http:
        path: /restaurants/
        method: get
  environment:
    restaurants_table: ${ self:custom.restaurantsTable }
```

As you can see, we also have added an environment variable for the function with the name of the DynamoDB table interpolated in a variable that we will define in the following section.

This `custom.restaurantsTable` variable is the same that we have used in the DynamoDB resource definition in the previous section.

In order to create the table into AWS, you have to make a deployment, so as we have seen before:

```bash
sls deploy --stage dev --aws-profile PROFILE_NAME
```

Now, we are going our DynamoDB table with some data. We are giong to use the following script:

```javascript
'use strict';

const co = require( 'co' );
const AWS = require( 'aws-sdk' );
var credentials = new AWS.SharedIniFileCredentials({profile: 'PROFILE_NAME'});
AWS.config.credentials = credentials;
AWS.config.region = "eu-west-1";
const dynamodb = new AWS.DynamoDB.DocumentClient();

let restaurants = [
  { 
    name: "Fangtasia", 
    image: "https://d2qt42rcwzspd6.cloudfront.net/manning/fangtasia.png", 
    themes: ["true blood"] 
  },
  { 
    name: "Shoney's", 
    image: "https://d2qt42rcwzspd6.cloudfront.net/manning/shoney's.png", 
    themes: ["cartoon", "rick and morty"] 
  },
  { 
    name: "Freddy's BBQ Joint", 
    image: "https://d2qt42rcwzspd6.cloudfront.net/manning/freddy's+bbq+joint.png", 
    themes: ["netflix", "house of cards"] 
  },
  { 
    name: "Pizza Planet", 
    image: "https://d2qt42rcwzspd6.cloudfront.net/manning/pizza+planet.png", 
    themes: ["netflix", "toy story"] 
  },
  { 
    name: "Leaky Cauldron", 
    image: "https://d2qt42rcwzspd6.cloudfront.net/manning/leaky+cauldron.png", 
    themes: ["movie", "harry potter"] 
  },
  { 
    name: "Lil' Bits", 
    image: "https://d2qt42rcwzspd6.cloudfront.net/manning/lil+bits.png", 
    themes: ["cartoon", "rick and morty"] 
  },
  { 
    name: "Fancy Eats", 
    image: "https://d2qt42rcwzspd6.cloudfront.net/manning/fancy+eats.png", 
    themes: ["cartoon", "rick and morty"] 
  },
  { 
    name: "Don Cuco", 
    image: "https://d2qt42rcwzspd6.cloudfront.net/manning/don%20cuco.png", 
    themes: ["cartoon", "rick and morty"] 
  },
];

let putReqs = restaurants.map(x => ({
  PutRequest: {
    Item: x
  }
}));

let req = {
  RequestItems: {
    'big-mouth-step-3-restaurants': putReqs
  }
};
dynamodb.batchWrite(req).promise().then(() => console.log("all done"));
```

Save into a file, for example `seed-restaurants.js` change the value of `PROFILE_NAME` with the right value and execute it using the following command:

```bash
node seed-restaurants.js
```

If everything was OK, you will see the **all-done** message.

## Other changes

As we said before, we are going to add several custom variables to use, for example, in the previous step for the restaurants table name:

```yaml
custom:
  serviceStage: ${ self:service }-${ self:provider.stage }
  restaurantsTable: ${ self:custom.serviceStage }-restaurants
  serviceEndpoint: ${ cf:${ self:custom.serviceStage }.ServiceEndpoint }
```

These variables definition must be also at the root level of the serverless yaml file. Take into consideration, that in yaml files _order matters_, so be sure that your definitions are in the right order to let interpolation resolve values the right way.

Pay special attention to `serviceEndpoint` variable interpolation. It uses a function called "cf" that is a CloudFormation interpolation function. This means that this value must be in the output of the CloudFormation referenced stack and the stack must exists in AWS.

Now, we are going to update our get-index function with the following code:

```javascript
'use strict';

const co = require( "co" );
const Promise = require( "bluebird" );
const fs = Promise.promisifyAll( require( "fs" ) );
const Mustache = require( "mustache" );
const http = require( "superagent-promise" )( require( "superagent" ), Promise );
const restaurantsApiRoot = process.env.restaurants_api;
const aws4 = require( "aws4" );
const URL = require( "url" );


const days = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];

var html;

function* loadHtml() {
  if( !html ) {
    html = yield fs.readFileAsync( 'static/index.html', 'utf-8' );
  }
  return html;
}

function* getRestaurants() {

  let url = URL.parse( restaurantsApiRoot );
  let opts = {
    host: url.hostname,
    path: url.pathname
  };

  aws4.sign( opts );

  return ( yield http
    .get( restaurantsApiRoot ) 
  ).body;
}

module.exports.handler = co.wrap( function* ( event, context, callback ) {
  
  let template = yield loadHtml();
  let restaurants = yield getRestaurants();
  let dayOfWeek = days[ new Date().getDay() ];
  let view = {
    dayOfWeek, 
    restaurants
  }
  let html = Mustache.render( template, view );

  const response = {
    statusCode: 200,
    body: html,
    headers: {
      'Content-type': 'text/html; charset=UTF-8'
    }
  };

  callback( null, response );
} ) ;
```

As you can see, we have added a request to `get-restaurants`, so we also need to add the endpoint as an environment variable to our serverless yaml file inside our get-index function definition, like this:

```yaml
environment:
  restaurants_api: ${ self:custom.serviceEndpoint }/restaurants
```

Dependencies of the function have also change, so be sure to install them before execute the function.

The only thing that remains is an update of our html file:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Big Mouth</title>

    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" 
            integrity="sha384-Dziy8F2VlJQLMShA6FHWNul/veM9bCkRUaLqr199K94ntO5QUrLJBEbYegdSkkqX" 
            crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

    <style>
      .fullscreenDiv {
        background-color: #05bafd;
        width: 100%;
        height: auto;
        bottom: 0px;
        top: 0px;
        left: 0;
        position: absolute;        
      }
      .restaurantsDiv {
        background-color: #ffffff;
        width: 100%;
        height: auto;
      }
      .dayOfWeek {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 32px;
        padding: 10px;
        height: auto;
        display: flex;
        justify-content: center;
      }
      .column-container {
        padding: 0;
        margin: 0;        
        list-style: none;
        display: flex;
        flex-flow: column;
        flex-wrap: wrap;
        justify-content: center;
      }
      .row-container {
        padding: 5px;
        margin: 5px;
        list-style: none;
        display: flex;
        flex-flow: row;
        flex-wrap: wrap;
        justify-content: center;
      }
      .item {
        padding: 5px;
        height: auto;
        margin-top: 10px;
        display: flex;
        flex-flow: row;
        flex-wrap: wrap;
        justify-content: center;
      }
      .restaurant {
        background-color: #00a8f7;
        border-radius: 10px;
        padding: 5px;
        height: auto;
        width: auto;
        margin-left: 40px;
        margin-right: 40px;
        margin-top: 15px;
        margin-bottom: 0px;
        display: flex;
        justify-content: center;
      }
      .restaurant-name {
        font-size: 24px;
        font-family:Arial, Helvetica, sans-serif;
        color: #ffffff;
        padding: 10px;
        margin: 0px;
      }
      .restaurant-image {
        padding-top: 0px;
        margin-top: 0px;
      }
      .row-container-left {
        list-style: none;
        display: flex;
        flex-flow: row;
        justify-content: flex-start;
      }
      .menu-text {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 24px;
        font-weight: bold;
        color: white;
      }
      .text-trail-space {
        margin-right: 10px;
      }
      .hidden {
        display: none;
      }
      label, button, input {
        display:block;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 18px;
      }
      
      fieldset { 
        padding:0; 
        border:0; 
        margin-top:25px; 
      }
    </style>
  </head>

  <body>
    <div class="fullscreenDiv">
      <ul class="column-container">
        <li class="item">
          <img id="logo" src="https://d2qt42rcwzspd6.cloudfront.net/manning/big-mouth.png">
        </li>
        <li class="item">
          <input id="theme" type="text" size="50" placeholder="enter a theme, eg. cartoon"/>
          <button onclick="searchRestaurants()">Find Restaurants</button>
        </li>
        <li>
          <div class="restaurantsDiv column-container">
            <b class="dayOfWeek">{{dayOfWeek}}</b>
            <ul id="restaurantsUl" class="row-container">
              {{#restaurants}}
              <li class="restaurant">
                <ul class="column-container">
                    <li class="item restaurant-name">{{name}}</li>
                    <li class="item restaurant-image">
                      <img src="{{image}}">
                    </li>
                </ul>
              </li>
              {{/restaurants}}
            </ul>
          </div>
        </li>
      </ul>
    </div>

  </body>

</html>
```

Now, you can test both functions locally. In this case, we are going to call DynamoDB service, so we need to add credentials that allow us perform the action:

```bash
sls invoke local -f get-index --stage dev --aws-profile PROFILE_NAME
```

Or

```bash
sls invoke local -f get-restaurants --stage dev --aws-profile PROFILE_NAME
```

You can also use `serverless-offline` to test locally adding the profile argument too:

```bash
sls offline --stage dev --aws-profile PROFILE_NAME
```

---

[<-- Previous step](../step-1/step-1.md) ------------- [Next step -->](../step-3/step-3.md)

[<-- Back to index](../../readme.md#Big-mouth)