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
