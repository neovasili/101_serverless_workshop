import { Injectable } from '@angular/core';
import { CognitoCallback, CognitoUtil, LoggedInCallback } from './cognito.service';
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';
import * as STS from 'aws-sdk/clients/sts';

@Injectable()
export class UserLoginService {

  private onLoginSuccess = ( callback: CognitoCallback, session: CognitoUserSession ) => {
    console.log( 'In authenticateUser onSuccess callback' );

    AWS.config.credentials = this.cognitoUtil
      .buildCognitoCreds( session.getIdToken().getJwtToken() );

    let clientParams: any = {};
    let sts = new STS( clientParams );

    sts.getCallerIdentity( function( err, data ) {
      console.log( 'UserLoginService: Successfully set the AWS credentials' );
      callback.cognitoCallback( null, session );
    } );
  };

  private onLoginError = ( callback: CognitoCallback, err ) => {
    callback.cognitoCallback( err.message, null );
  };

  constructor( public cognitoUtil: CognitoUtil ) {
  }

  authenticate( username: string, password: string, callback: CognitoCallback ) {
    console.log( 'UserLoginService: starting the authentication' );

    let authenticationData = {
      Username: username,
      Password: password,
    };
    let authenticationDetails = new AuthenticationDetails( authenticationData );

    let userData = {
      Username: username,
      Pool: this.cognitoUtil.getUserPool()
    };

    console.log( 'UserLoginService: Params set...Authenticating the user' );
    let cognitoUser = new CognitoUser( userData );
    console.log( '(Authenticate) USER: ', userData.Username );
    cognitoUser.authenticateUser( authenticationDetails, {
      newPasswordRequired: ( userAttributes, requiredAttributes ) =>
        callback.cognitoCallback( `User needs to set password.`, null ),
      onSuccess: result => this.onLoginSuccess( callback, result ),
      onFailure: err => this.onLoginError( callback, err ),
      mfaRequired: ( challengeName, challengeParameters ) => {
        callback.handleMFAStep( challengeName,
          challengeParameters,
          ( confirmationCode: string ) => {
            cognitoUser.sendMFACode( confirmationCode, {
              onSuccess: result => this.onLoginSuccess( callback, result ),
              onFailure: err => this.onLoginError( callback, err )
            });
          });
      }
    });
  }

  forgotPassword( username: string, callback: CognitoCallback ) {
    let userData = {
      Username: username,
      Pool: this.cognitoUtil.getUserPool()
    };

    let cognitoUser = new CognitoUser( userData );

    cognitoUser.forgotPassword( {
      onSuccess: function() {

      },
      onFailure: function( err ) {
        callback.cognitoCallback( err.message, null );
      },
      inputVerificationCode() {
        callback.cognitoCallback( null, null );
      }
    });
  }

  confirmNewPassword( email: string,
                      verificationCode: string,
                      password: string,
                      callback: CognitoCallback ) {
    let userData = {
      Username: email,
      Pool: this.cognitoUtil.getUserPool()
    };

    let cognitoUser = new CognitoUser( userData );

    cognitoUser.confirmPassword( verificationCode, password, {
      onSuccess: function() {
        callback.cognitoCallback( null, null );
      },
      onFailure: function( err ) {
        callback.cognitoCallback( err.message, null );
      }
    });
  }

  logout() {
    console.log( 'UserLoginService: Logging out' );
    this.cognitoUtil.getCurrentUser().signOut();
  }

  isAuthenticated( callback: LoggedInCallback ) {
    if( callback == null )
      throw('UserLoginService: Callback in isAuthenticated() cannot be null');

    let cognitoUser = this.cognitoUtil.getCurrentUser();

    if( cognitoUser != null ) {
      cognitoUser.getSession( function( err, session ) {
        if( err ) {
          console.log( 'UserLoginService: Couldn\'t get the session: ' + err, err.stack );
          callback.isLoggedIn( err, false );
        }
        else {
          console.log( 'UserLoginService: Session is ' + session.isValid() );
          callback.isLoggedIn( err, session.isValid() );
        }
      } );
    } else {
      console.log( 'UserLoginService: can\'t retrieve the current user' );
      callback.isLoggedIn( 'Can\'t retrieve the CurrentUser', false );
    }
  }
}
