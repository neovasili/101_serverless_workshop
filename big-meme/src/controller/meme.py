import os
import json

from src.service.meme import MemeService

MEMES_TABLE_NAME = os.environ[ 'MemesTableName' ]

def get_memes_by_theme( event, context ):
    search_criteria = event['body']
    memes = MemeService( MEMES_TABLE_NAME ) \
        .get_memes_by_theme( search_criteria )

    response = {
        "statusCode": 200,
        "body": json.dumps( memes ),
        "headers": {
            "Content-type": "application/json"
        }
    }

    return response

def get_all_memes( event, context ):
    memes = MemeService( MEMES_TABLE_NAME ) \
        .get_all_memes()

    response = {
        "statusCode": 200,
        "body": json.dumps( memes ),
        "headers": {
            "Content-type": "application/json"
        }
    }

    return response
    