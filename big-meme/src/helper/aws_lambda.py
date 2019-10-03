import json
import boto3
import ast

class AsyncLambdaHelper( object ):
    def __init__( self, lambda_function_name ):
        self.__function_name = lambda_function_name
        self.__lambda_client = boto3.client( 'lambda' )

    def invoke( self, payload ):
        response = ""
        raw_response_bytes = self.__lambda_client.invoke( 
            FunctionName=self.__function_name,
            LogType='None',
            Payload=payload )

        if raw_response_bytes:
            response = ast.literal_eval( 
                json.loads( 
                    raw_response_bytes[ "Payload" ]
                        .read()
                        .decode( 'utf-8' ) 
                    )[ 'body' ]
                )
        
        return response