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