import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasswordComponent } from './new-password.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserRegistrationService } from '../../service/user-registration.service';
import { CognitoUtil } from '../../service/cognito.service';
import { UserLoginService } from '../../service/user-login.service';

describe( 'NewPasswordComponent', () => {
    let component: NewPasswordComponent;
    let fixture: ComponentFixture<NewPasswordComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            declarations: [ NewPasswordComponent ],
            imports: [
                RouterTestingModule,
                FormsModule,
                MatFormFieldModule,
                MatInputModule
            ],
            providers: [
                UserLoginService,
                UserRegistrationService,
                CognitoUtil
            ]
        } )
            .compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( NewPasswordComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
