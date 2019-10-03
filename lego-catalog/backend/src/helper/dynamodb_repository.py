import boto3
import json
import decimal

from src.helper.repository import Repository
from boto3.dynamodb.conditions import Key, Attr

# Helper class to convert a DynamoDB item to JSON.
class DecimalEncoder( json.JSONEncoder ):
    def default( self, element ):
      if isinstance( element, decimal.Decimal ):
        return str( element )
      return super( DecimalEncoder, self ).default( element )
        
class DynamoDBRepository( Repository ):

  def __init__( self, table_name ):
    super().__init__()
    self.__table_name = table_name
    self.__client = boto3.resource( 'dynamodb' )
    self.__table = self.__client.Table( self.__table_name )

  def add( self, object ):
    response = self.__table.put_item(
        Item = json.loads( object )
      )

  def update( self, object ):
    response = self.__table.put_item(
        Item = json.loads( object )
      )

  def delete( self, object ):
    pass

  def get_by_id( self, object ):
    dynamodb_item = self.__table.get_item(
        Key=object
      )[ 'Item' ]
    return json.dumps( dynamodb_item, indent=4, cls=DecimalEncoder )