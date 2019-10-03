import boto3
import json
import decimal

session = boto3.session.Session( profile_name= 'jmcore' )
dynamodb = session.resource( 'dynamodb', region_name= 'eu-west-1' )
table = dynamodb.Table( 'memes-dev' )

with open( "memes-data.json" ) as json_file:
    restaurants = json.load( json_file )
    for restaurant in restaurants:
        name = restaurant[ 'name' ]
        image = restaurant[ 'image' ]
        themes = restaurant[ 'themes' ]

        response = table.put_item(
            Item = {
               'name': name ,
               'image': image,
               'themes': str( themes )
            }
        )