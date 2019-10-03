import boto3
import json

from src.helper.repository import Repository
from boto3.dynamodb.conditions import Key, Attr

class DynamoDBRepository( Repository ):

    def __init__( self, table_name ):
        super().__init__()
        self.__table_name = table_name
        self.__client = boto3.resource( 'dynamodb' )
        self.__table = self.__client.Table( self.__table_name )

    def add( self, object ):
        pass

    def update( self, object ):
        pass

    def delete( self, object ):
        pass

    def get_by_id( self, object ):
        pass

    def get_by_theme( self, object ):
        theme = json.loads( object )[ 'theme' ]
        result = ""

        if len( theme ) > 0:
            result = self.__table.scan( 
                    FilterExpression=Attr( 'themes' ).contains( theme )
                )[ 'Items' ]
        else:
            result = self.get_all()

        return result

    def get_all( self ):
        return self.__table.scan()[ 'Items' ]