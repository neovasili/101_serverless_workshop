import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { AppRoutingModule } from './module/app-routing.module';
import { PrivateCommonComponent } from './component/private-common/private-common.component';
import { SetListComponent } from './component/set-list/set-list.component';
import { PrivateHeaderMenuComponent } from './component/private-header-menu/private-header-menu.component';
import { SetCreateComponent } from './component/set-create/set-create.component';
import { SetEditComponent } from './component/set-edit/set-edit.component';
import { SetDetailComponent } from './component/set-detail/set-detail.component';
import { FormsModule } from '@angular/forms';
import { UserLoginService } from './service/user-login.service';
import { CognitoUtil } from './service/cognito.service';
import { NewPasswordComponent } from './component/new-password/new-password.component';
import { UserRegistrationService } from './service/user-registration.service';
import { LogoutComponent } from './component/logout/logout.component';
import { SetService } from './service/set.service';
import { RouterExtService } from './service/app-routing.service'
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule( {
  declarations: [
    AppComponent,
    LoginComponent,
    PrivateCommonComponent,
    SetListComponent,
    PrivateHeaderMenuComponent,
    SetCreateComponent,
    SetEditComponent,
    SetDetailComponent,
    NewPasswordComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    HttpClientModule
  ],
  providers: [
    UserLoginService,
    UserRegistrationService,
    CognitoUtil,
    SetService,
    RouterExtService
  ],
  bootstrap: [ AppComponent ],
  exports: []
} )
export class AppModule {
}