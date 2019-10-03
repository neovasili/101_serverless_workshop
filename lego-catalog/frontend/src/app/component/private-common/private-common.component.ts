import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from '../../service/user-login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component( {
  selector: 'app-private-common',
  templateUrl: './private-common.component.html',
  styleUrls: [ './private-common.component.css' ]
} )
export class PrivateCommonComponent implements OnInit {

  constructor( public router: Router,
                public userService: UserLoginService,
                public snackBar: MatSnackBar ) {
    this.userService.isAuthenticated( this );
  }

  ngOnInit() {
  }

  isLoggedIn( message: string, isLoggedIn: boolean ) {
    if ( !isLoggedIn ) {
      this.router.navigate( [ '/' ] );
    }
  }

  openSnackBar( message: string, action: string ) {
    this.snackBar.open( message, action, {
      duration: 2000,
    } );
  }
}
