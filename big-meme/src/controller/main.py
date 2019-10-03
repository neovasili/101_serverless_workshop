import os
import pystache
import datetime

from src.helper.aws_lambda import AsyncLambdaHelper
from src.helper.files import FilesHelper

html_template = ""
STATIC_CONFG = FilesHelper( "../../resources/configuration" +
    "/static-environment.json" ) \
    .get_json_file_content()

GET_MEMES_FUNCTION_NAME = os.environ[ 'LambdaFunctionName' ]
SEARCH_URL = os.environ[ 'SearchAPIURL' ]
AWS_REGION = os.environ[ 'Region' ]
COGNITO_USER_POOL_ID = os.environ[ 'CognitoUserPoolID' ]
COGNITO_CLIENT_ID = os.environ[ 'CognitoClientID' ]

def get_index( event, context ):
  html_template = FilesHelper( STATIC_CONFG[ 'index-relative-location' ] ) \
    .get_text_file_content()

  memes = AsyncLambdaHelper( GET_MEMES_FUNCTION_NAME ) \
    .invoke( "{}" )

  dayOfWeek = STATIC_CONFG[ 'dow' ][ datetime.datetime.today().weekday() ]

  html_view = {
    "dayOfWeek": dayOfWeek,
    "memes": memes,
    "awsRegion": AWS_REGION,
    "cognitoUserPoolId": COGNITO_USER_POOL_ID,
    "cognitoClientId": COGNITO_CLIENT_ID,
    "searchUrl": SEARCH_URL
  }

  html = pystache.render( html_template, html_view )

  response = {
    "statusCode": 200,
    "body": html,
    "headers": {
      "Content-type": "text/html"
    }
  }

  return response
    