import { Component, OnInit } from '@angular/core';
import { CognitoUtil } from '../../service/cognito.service';

@Component( {
  selector: 'app-private-header-menu',
  templateUrl: './private-header-menu.component.html',
  styleUrls: [ './private-header-menu.component.css' ]
} )
export class PrivateHeaderMenuComponent implements OnInit {

  userName: string;

  constructor(
    public cognitoUtil: CognitoUtil ) {
      this.userName = this.cognitoUtil.getCurrentUser().getUsername();
  }

  ngOnInit() {
  }
}
