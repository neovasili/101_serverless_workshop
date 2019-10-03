import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDetailComponent } from './set-detail.component';
import { AppComponent } from '../../app.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { UserLoginService } from '../../service/user-login.service';
import { UserRegistrationService } from '../../service/user-registration.service';
import { CognitoUtil } from '../../service/cognito.service';
import { SetService } from '../../service/set.service';

describe( 'SetDetailComponent', () => {
    let component: SetDetailComponent;
    let fixture: ComponentFixture<SetDetailComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            declarations: [
            	AppComponent,
	            SetDetailComponent
            ],
	        imports: [
		        MatCardModule,
		        MatIconModule,
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
        fixture = TestBed.createComponent( SetDetailComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } ); */
} );
