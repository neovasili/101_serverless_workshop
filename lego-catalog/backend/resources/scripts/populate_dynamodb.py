import boto3
import json

session = boto3.session.Session( profile_name= 'jmcore' )
dynamodb = session.resource( 'dynamodb', region_name= 'eu-west-1' )
table = dynamodb.Table( 'serverless_workshop' )

with open( "user-sets-data.json" ) as json_file:
  users = json.load( json_file )
  for user in users:
    userID = user[ 'userID' ]
    sets = user[ 'sets' ]

    response = table.put_item(
      Item = {
        'userID': userID,
        'sets': sets
      }
    )