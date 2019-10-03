import json

from src.helper.dynamodb_repository import DynamoDBRepository
from src.model.user import User
from src.service.set import SetService

class UserService( object ):

  def __init__( self, 
                user_id,
                table_name ):
    self.__table          = DynamoDBRepository( table_name )
    self.__user           = User( 
        self.__table.get_by_id( { "userID": user_id } )
      )
    self.__set_service    = SetService( self.__user.get_user_sets() )

  def __str__( self ):
    return str( self.__user )

  def __have_set( self, object ):
    return self.get_set_by_element( object )

  def __update_sets( self ):
    self.__set_service = SetService( self.__user.get_user_sets() )

  def __save( self ):
    self.__update_sets()
    self.__table.update( str( self ) )

  def get_set_by_element( self, set_item ):
    return self.__set_service.get_set_by_element( set_item )

  def get_set_by_reference( self, set_id ):
    return self.__set_service.get_set_by_reference( set_id )

  def get_user_sets( self ):
    return json.dumps( self.__user.get_user_sets() )

  def add_user_set( self, object ):
    incoming_set = self.__have_set( object )

    if incoming_set:
      return None
    else:
      self.__user.add_user_set( object )
      self.__save()
      return object

  def update_user_set( self, object, set_id ):
    incoming_set = self.__have_set( object )
    
    if incoming_set:

      if json.loads( incoming_set )[ "setReference" ] == set_id:
        self.__user.update_user_set( object )
        self.__save()
        return object
      
    return None

  def delete_user_set( self, set_id ):
    incoming_set = self.get_set_by_reference( set_id )

    if incoming_set:
      self.__user.delete_user_set( incoming_set )
      self.__save()
      return incoming_set
      
    return None