import { Inject, Injectable } from '@angular/core';
import { CognitoCallback, CognitoUtil } from './cognito.service';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { NewPasswordUser } from '../component/new-password/new-password.component';
import * as AWS from 'aws-sdk/global';

@Injectable()
export class UserRegistrationService {

  constructor( @Inject( CognitoUtil ) public cognitoUtil: CognitoUtil ) {
  }

  confirmRegistration( username: string, confirmationCode: string, callback: CognitoCallback ): void {
    let userData = {
      Username: username,
      Pool: this.cognitoUtil.getUserPool()
    };

    let cognitoUser = new CognitoUser( userData );

    cognitoUser.confirmRegistration( confirmationCode, true, function( err, result ) {
      if( err ) {
        callback.cognitoCallback( err.message, null );
      } else {
        callback.cognitoCallback( null, result );
      }
    });
  }

  resendCode( username: string, callback: CognitoCallback ): void {
    let userData = {
      Username: username,
      Pool: this.cognitoUtil.getUserPool()
    };

    let cognitoUser = new CognitoUser( userData );

    cognitoUser.resendConfirmationCode( function( err, result ) {
      if( err ) {
        callback.cognitoCallback( err.message, null );
      } else {
        callback.cognitoCallback( null, result );
      }
    });
  }

  newPassword( newPasswordUser: NewPasswordUser, callback: CognitoCallback ): void {
    console.log( newPasswordUser );
    // Get these details and call
    //cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
    let authenticationData = {
      Username: newPasswordUser.username,
      Password: newPasswordUser.existingPassword,
    };
    let authenticationDetails = new AuthenticationDetails( authenticationData );

    let userData = {
      Username: newPasswordUser.username,
      Pool: this.cognitoUtil.getUserPool()
    };

    console.log( 'UserLoginService: Params set...Authenticating the user' );
    let cognitoUser = new CognitoUser( userData );
    console.log( 'UserLoginService: config is ' + AWS.config );
    cognitoUser.authenticateUser( authenticationDetails, {
      newPasswordRequired: function( userAttributes, requiredAttributes ) {
        // User was signed up by an admin and must provide new
        // password and required attributes, if any, to complete
        // authentication.

        // the api doesn't accept this field back
        delete userAttributes.email_verified;
        cognitoUser.completeNewPasswordChallenge( newPasswordUser.password, requiredAttributes, {
          onSuccess: function( result ) {
            console.log( "completeNewPasswordChallenge SUCCESS" );
            callback.cognitoCallback( null, userAttributes );
          },
          onFailure: function( err ) {
            console.log( "completeNewPasswordChallenge FAILURE" );
            callback.cognitoCallback( err, null );
          }
        });
      },
      onSuccess: function( result ) {
        console.log( "newPasswordRequired SUCCESS" );
        callback.cognitoCallback( null, result );
      },
      onFailure: function( err ) {
        console.log( "newPasswordRequired FAILURE" );
        callback.cognitoCallback( err, null );
      }
    });
  }
}
