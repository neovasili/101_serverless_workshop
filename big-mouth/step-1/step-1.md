# Big mouth

Big mouth is a simple serverless web demo project that contains:

*  API Gateway resources
*  AWS Lambda functions
*  DynamoDB table
*  Cognito user pool

The application is a restaurants search website, where you can find restaurants by theme using a search function. But search functionality will be reserved only for registered users, so you will have a register user and sign in/out functions in the frontend.

As a training project, the frontend of our application will be embeded, rendered and served by the backend, to avoid typical cors problems and abstract us from the design and modeling of the client.

So with this small project we will cover the fullstack of a web project using serverless creating the Serverless Framework parts from the scratch but with the support of provided code from the solution.

We will divide this work in three main phases:

*  Create get-index function
*  Connect with DynamoDB
*  Connect with AWS Cognito

# Step 1

We are going to use nodejs business logic and we only consider one service for this application.

First of all, create your Serverless Framework service:

```bash
sls create -t aws-nodejs -n hello-world
```

Once you have the basic project structure created, we are going to configure several things in the serverless yaml:

*  Set provider region to eu-west-1
*  Set provider profile
*  Set provider stage
*  Set provider timeout
*  Set provider memorySize
*  Set provider tags
*  Set provider logs

Once we have configured the basis, we are going to add two very useful plugins: `serverless-pseudo-parameters`and `serverless-offline`. We only have to type the following in our terminal:

```bash
npm install serverless-pseudo-parameters --save
```
This plugin will help us interpolate some AWS values for the service config later.

```bash
npm install serverless-offline --save
```

This is a verty useful plugin to simulate API Gateway and AWS lambda localy in your machine, so you can test your services using a web browser or _postman_ before deploying it.

Now we are going to create our get-index function. We have to add several new lines in our serverless yaml. We will create a http event to trigger our `get-index` function. We have to define also the `path` for the http event and the `method`.

We are going to create a new folder inside our workspace named `functions`and inside it, we are going to add a new file `get-index.js`with the following content:

```javascript
'use strict';

const co = require( "co" );
const Promise = require( "bluebird" );
const fs = Promise.promisifyAll( require( "fs" ) );
const Mustache = require( "mustache" );

const days = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];

var html;

function* loadHtml() {
  if( !html ) {
    html = yield fs.readFileAsync( 'static/index.html', 'utf-8' );
  }
  return html;
}

module.exports.handler = co.wrap( function* ( event, context, callback ) {
  
  let template = yield loadHtml();
  let dayOfWeek = days[ new Date().getDay() ];
  let view = {
    dayOfWeek
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

This `get-index` function have some dependencies, so we have to install them:

```bash
npm install co bluebird fs mustache --save
```

As you can see, the function retrieves an html file, apply some transformations and return the html content, so we need to create a new folder `static` with the html file:

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
          </div>
        </li>
      </ul>
    </div>

  </body>

</html>
```

Now, we can test our function locally to se the result:

```bash
sls invoke local -f get-index
```

We will see the result json containing the html procesed file in the output. This function `get-index` will return an html file, so you can also invoke the service from a web browser and see the website.

For this, we are going to use the serverless offline plugin:

```bash
sls offline --stage dev
```

When server is up, we can navigate to http://localhost:3000 and see the created website.

---

[Next step -->](../step-2/step-2.md)

[<-- Back to index](../../readme.md#Big-mouth)