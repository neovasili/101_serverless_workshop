import { Component, OnInit } from '@angular/core';
import { UserLoginService } from '../../service/user-login.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component( {
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
} )
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  errorMessage: string;
  mfaStep = false;
  mfaData = {
    destination: '',
    callback: null
  };

  title = 'lego catalog';
  hide = true;

  constructor( public router: Router,
                public userService: UserLoginService,
                public snackBar: MatSnackBar ) {
  }

  ngOnInit() {
  }

  onLogin() {
    if ( this.email == null || this.password == null ) {
      this.errorMessage = 'All fields are required';
      this.openSnackBar( 'All fields are required.', 'Not logged in' );
      return;
    }
    this.errorMessage = null;
    console.log( 'Init login process...' );
    this.userService.authenticate( this.email, this.password, this );
  }

  cognitoCallback( message: string, result: any ) {
    if ( message != null ) { //error
      this.errorMessage = message;
      console.log( 'result: ' + this.errorMessage );
      this.openSnackBar( this.errorMessage, 'An error ocurred' );
      if ( this.errorMessage === 'User is not confirmed.' ) {
        console.log( 'redirecting' );
        this.openSnackBar( this.errorMessage, 'Redirecting' );
        this.router.navigate( [ '/home/confirmRegistration', this.email ] );
      } else if ( this.errorMessage === 'User needs to set password.' ) {
        this.openSnackBar( this.errorMessage, 'An error ocurred' );
        console.log( 'redirecting to set new password' );
        this.router.navigate( [ '/new-password' ] );
      }
    } else { //success
      
      this.openSnackBar( 'User logged successfully.', 'Log in' );
      this.router.navigateByUrl( '/set-list', {skipLocationChange: true} )
        .then( () =>
          this.router.navigate( ["/set-list"] )
        );
    }
  }

  isLoggedIn( message: string, isLoggedIn: boolean ) {
    if ( isLoggedIn ) {
      this.router.navigateByUrl( '/set-list', {skipLocationChange: true} )
        .then( () =>
          this.router.navigate( ["/set-list"] )
        );
    }
  }

  openSnackBar( message: string, action: string ) {
    this.snackBar.open( message, action, {
      duration: 4000,
    } );
  }
}
