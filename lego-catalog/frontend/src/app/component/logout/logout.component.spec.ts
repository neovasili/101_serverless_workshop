import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutComponent } from './logout.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserLoginService } from '../../service/user-login.service';
import { CognitoUtil } from '../../service/cognito.service';

describe( 'LogoutComponent', () => {
    let component: LogoutComponent;
    let fixture: ComponentFixture<LogoutComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            declarations: [ LogoutComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                UserLoginService,
                CognitoUtil
            ]
        } )
            .compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( LogoutComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
