'use strict';

const co = require( "co" );
const AWS = require( "aws-sdk" )
const dynamodb = new AWS.DynamoDB.DocumentClient()

const defaultResults = process.env.defaultResults || 8;
const tableName = process.env.restaurants_table;

function* findRestaurantsByTheme( theme, count ) {
    let request = {
        TableName: tableName,
        Limit: count,
        FilterExpression: 'contains( #themes, :themes )',
        ExpressionAttributeNames: { '#themes': 'themes' },
        ExpressionAttributeValues: { ':themes': theme }
    };

    let response = yield dynamodb.scan( request ).promise();

    return response.Items;
}

module.exports.handler = co.wrap( function* ( event, context, callback ) {
  
    let request = JSON.parse( event.body );
    let restaurants = yield findRestaurantsByTheme( request.theme, defaultResults );

    const response = {
        statusCode: 200,
        body: JSON.stringify( restaurants )
    };

    callback( null, response );
} ) ;