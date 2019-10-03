import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetListComponent } from './set-list.component';
import { AppComponent } from '../../app.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { UserLoginService } from '../../service/user-login.service';
import { UserRegistrationService } from '../../service/user-registration.service';
import { CognitoUtil } from '../../service/cognito.service';
import { SetService } from '../../service/set.service';

describe( 'SetListComponent', () => {
    let component: SetListComponent;
    let fixture: ComponentFixture<SetListComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            declarations: [
            	AppComponent,
	            SetListComponent
            ],
	        imports: [
		        MatCardModule,
		        MatIconModule,
		        MatListModule,
		        RouterTestingModule,
		        HttpClientModule
	        ],
	        providers: [
		        UserLoginService,
		        UserRegistrationService,
		        CognitoUtil,
		        SetService
	        ]
        } )
            .compileComponents();
    } ) );
	/*
    beforeEach( () => {
        fixture = TestBed.createComponent( SetListComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } ); */
} );
