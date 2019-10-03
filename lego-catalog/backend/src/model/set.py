import json

class Set( object ):

  def __init__( self, data ):
    self.__dict__ = json.loads( data )

  def __str__( self ):
    return json.dumps( self.__dict__ )

  def __eq__( self, object ):
    return self.setReference == object.setReference