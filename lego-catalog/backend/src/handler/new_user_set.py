import os

from src.service.user import UserService

from src.helper.response import ResponseHelper

USERS_TABLE = os.environ[ "UsersTable" ]
user = None

def handler( event, context ):

  user_id = event[ 'pathParameters' ][ 'user_id' ]

  user = UserService( user_id, USERS_TABLE )

  result = user.add_user_set( event[ 'body' ] )

  if result:
    response = ResponseHelper().item_created( result )
  else:
    response = ResponseHelper().already_exists()

  return response