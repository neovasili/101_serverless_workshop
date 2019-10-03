import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateCommonComponent } from './private-common.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PrivateHeaderMenuComponent } from '../private-header-menu/private-header-menu.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserLoginService } from '../../service/user-login.service';
import { CognitoUtil } from '../../service/cognito.service';

describe( 'PrivateCommonComponent', () => {
    let component: PrivateCommonComponent;
    let fixture: ComponentFixture<PrivateCommonComponent>;

    beforeEach( async( () => {
        TestBed.configureTestingModule( {
            declarations: [
                PrivateCommonComponent,
                PrivateHeaderMenuComponent
            ],
            imports: [
                RouterTestingModule,
                MatCardModule,
                MatIconModule,
                MatToolbarModule,
                MatSnackBarModule
            ],
            providers: [
                UserLoginService,
                CognitoUtil
            ]
        } )
            .compileComponents();
    } ) );

    beforeEach( () => {
        fixture = TestBed.createComponent( PrivateCommonComponent );
        component = fixture.componentInstance;
        fixture.detectChanges();
    } );

    it( 'should create', () => {
        expect( component ).toBeTruthy();
    } );
} );
