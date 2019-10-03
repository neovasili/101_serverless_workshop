import json

from src.model.set import Set

class User( object ):
  
  def __init__( self, data ):
    self.__dict__ = json.loads( data )

  def __str__( self ):
    return json.dumps( self.__dict__ )

  def __eq__( self, object ):
    return self.userID == object.userID

  def delete_user_set( self, object ):
    incoming_set = Set( object )

    for index, set_item in enumerate( self.sets ):
      set_element = Set( json.dumps( set_item ) )
      if set_element == incoming_set:
        del self.sets[ index ]

  def update_user_set( self, object ):
    incoming_set = Set( object )

    for index, set_item in enumerate( self.sets ):
      set_element = Set( json.dumps( set_item ) )
      if set_element == incoming_set:
        self.sets[ index ] = json.loads( object )

  def add_user_set( self, object ):
    self.sets.append( json.loads( object ) )

  def get_user_sets( self ):
    return self.sets