import os

from src.service.user import UserService

from src.helper.response import ResponseHelper

USERS_TABLE = os.environ[ "UsersTable" ]
user = None

def handler( event, context ):

  user_id = event[ 'pathParameters' ][ 'user_id' ]
  set_id  = event[ 'pathParameters' ][ 'set_id' ]

  user = UserService( user_id, USERS_TABLE )

  result = user.delete_user_set( set_id )

  if result:
    response = ResponseHelper().item_deleted( result )
  else:
    response = ResponseHelper().not_found()

  return response