import { Injectable } from '@angular/core';
import { Set } from '../model/set';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { CognitoUtil } from './cognito.service';

const httpOptions = {
  headers: new HttpHeaders( {
    'Content-Type': 'application/json',
    'x-api-key': environment.apiKey
  } )
};

@Injectable( {
  providedIn: 'root'
} )
export class SetService {

  userToken: string;
  userName: string;
  setServiceBaseUrl: string;

  constructor( private http: HttpClient,
      public cognitoUtil: CognitoUtil ) {
    this.userName = this.cognitoUtil.getCurrentUser().getUsername();
    this.setServiceBaseUrl = environment.APIUrl + '/user/' + this.userName + '/set/'
    this.userToken = this.cognitoUtil.getCurrentUser().getSession(
      function( err, session ) {
        return session.getIdToken().getJwtToken();
      } );

    // console.log( this.userToken );
    httpOptions.headers =
      httpOptions.headers.set( 'Authorization', this.userToken );
  }

  reloadUser(): void {
    this.userName = this.cognitoUtil.getCurrentUser().getUsername();
    this.setServiceBaseUrl = environment.APIUrl + '/user/' + this.userName + '/set/'
  }

  save( set: Set ): Observable<Set> {
    set.userID = this.userName;

    const saveSetUrl = this.setServiceBaseUrl

    return this.http.post<Set>( 
      saveSetUrl,
      set,
      httpOptions )
      .pipe(
        catchError( this.handleError( 'saveSet', null ) )
      );
  }

  updateSet( set: Set, setReference: string ): Observable<Set> {
    set.userID = this.userName;

    const getSetUrl = this.setServiceBaseUrl + setReference;
    
    return this.http.put<Set>( 
      getSetUrl, 
      set,
      httpOptions )
      .pipe(
        catchError( this.handleError( 'updateSet', null ) )
      );
  }
  
  getSet( setReference: string ): Observable<Set> {
    const getSetUrl = this.setServiceBaseUrl + setReference;
    
    return this.http.get<Set>( 
      getSetUrl, 
      httpOptions )
      .pipe(
        catchError( this.handleError( 'getSet', null ) )
      );
    }

  getUserSets(): Observable<Set[]> {
    const getSetsUrl = this.setServiceBaseUrl;
    
    return this.http.get<Set[]>( 
      getSetsUrl, 
      httpOptions )
      .pipe(
        catchError( this.handleError( 'getUserSets', null ) )
      );
  }

	delete( setReference: string ): Observable<Set> {
    const deleteSetsUrl = this.setServiceBaseUrl + setReference;

    return this.http.delete<Set>( 
      deleteSetsUrl, 
      httpOptions )
      .pipe(
        catchError( this.handleError( 'deleteSet', null ) )
      );
	}

  private handleError<T>( operation = 'operation', result?: T ) {
    return ( error: any ): Observable<T> => {
      console.error( error );
      console.log( `${operation} failed: ${error.message}` );
      return of( result as T );
    };
  }
}
