import json

class ResponseHelper( object ):

  def __init__( self ):
    self.__response = {
      "statusCode": 200,
      "body": {
        "message": "OK"
      },
      "headers": {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    }

  def OK( self, data ):
    self.__response[ "statusCode" ] = 200
    self.__response[ "body" ] = data

    return self.__response

  def not_found( self ):
    self.__response[ "statusCode" ] = 404
    self.__response[ "body" ] = '{ "error": "Element not found" }'

    return self.__response

  def item_created( self, data ):
    self.__response[ "statusCode" ] = 201
    self.__response[ "body" ] = data

    return self.__response

  def item_updated( self, data ):
    self.__response[ "statusCode" ] = 200
    self.__response[ "body" ] = data

    return self.__response

  def item_deleted( self, data ):
    self.__response[ "statusCode" ] = 200
    self.__response[ "body" ] = data

    return self.__response

  def already_exists( self ):
    self.__response[ "statusCode" ] = 400
    self.__response[ "body" ] = '{ "error": "Element already exists" }'

    return self.__response