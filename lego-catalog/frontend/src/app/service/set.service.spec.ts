import { TestBed, inject } from '@angular/core/testing';

import { SetService } from './set.service';
import { UserLoginService } from './user-login.service';
import { UserRegistrationService } from './user-registration.service';
import { CognitoUtil } from './cognito.service';
import { AppComponent } from '../app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe( 'SetService', () => {
    beforeEach( () => {
        TestBed.configureTestingModule( {
	        declarations: [
		        AppComponent
	        ],
	        imports: [
		        RouterTestingModule,
		        HttpClientTestingModule
	        ],
	        providers: [
		        UserLoginService,
		        UserRegistrationService,
		        CognitoUtil,
		        SetService
	        ]
        } );
    } );
	/*
    it( 'should be created', inject( [ SetService ], ( service: SetService ) => {
        expect( service ).toBeTruthy();
    } ) ); */
} );
