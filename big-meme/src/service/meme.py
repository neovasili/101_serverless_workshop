from src.model.meme import Meme
from src.helper.dynamodb_repository import DynamoDBRepository

class MemeService( object ):

    def __init__( self, table_name ):
        self.__memes_repository = DynamoDBRepository( table_name )
        self.__memes = self.__memes_repository.get_all()

    def get_all_memes( self ):
        return self.__memes
    
    def get_memes_by_theme( self, search_criteria ):
        self.__memes = self.__memes_repository \
            .get_by_theme( search_criteria )

        return self.__memes