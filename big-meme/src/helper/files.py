import json
import os

class FilesHelper( object ):

    def __init__( self, file_relative_path ):
        self.__working_dir = os.path.dirname( os.path.abspath( __file__ ) )
        self.__filename = os.path.join( 
                self.__working_dir, 
                file_relative_path 
            )

    def read_file_content( self ):
        file_handler = open( self.__filename, 'r' )
        file_content = file_handler.read()
        file_handler.close()
        
        return file_content

    def get_text_file_content( self ):
        return self.read_file_content()

    def get_json_file_content( self ):
        return json.loads( self.read_file_content() )