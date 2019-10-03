import os

from src.service.user import UserService

from src.helper.response import ResponseHelper

USERS_TABLE = os.environ[ "UsersTable" ]
user = None

def handler( event, context ):

  user_id = event[ 'pathParameters' ][ 'user_id' ]

  user = UserService( user_id, USERS_TABLE )
  
  result = user.get_user_sets()

  if result:
    response = ResponseHelper().OK( result )
  else:
    response = ResponseHelper().not_found()

  return response