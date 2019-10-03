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
