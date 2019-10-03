import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRegistrationService } from '../../service/user-registration.service';
import { UserLoginService } from '../../service/user-login.service';

export class NewPasswordUser {
  username: string;
  existingPassword: string;
  password: string;
}

@Component( {
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: [ './new-password.component.css' ]
} )
export class NewPasswordComponent implements OnInit {

  registrationUser: NewPasswordUser;
  router: Router;
  errorMessage: string;

  constructor( public userRegistration: UserRegistrationService, 
      public userService: UserLoginService, 
      router: Router ) {
    this.router = router;
    this.onInit();
  }

  onInit() {
    this.registrationUser = new NewPasswordUser();
    this.errorMessage = null;
  }

  ngOnInit() {
  }

  onRegister() {
    this.errorMessage = null;
    this.userRegistration.newPassword( this.registrationUser, this );
  }

  cognitoCallback( message: string, result: any ) {
    if ( message != null ) {
      this.errorMessage = message;
    } else {
      this.router.navigate( [ '/set-list' ] );
    }
  }

  isLoggedIn( message: string, isLoggedIn: boolean ) {
    if ( isLoggedIn )
      this.router.navigate( [ '/set-list' ] );
  }
}
