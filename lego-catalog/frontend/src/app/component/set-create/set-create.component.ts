import { Component, OnInit } from '@angular/core';
import { Set } from '../../model/set';
import { SetService } from '../../service/set.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component( {
  selector: 'app-set-create',
  templateUrl: './set-create.component.html',
  styleUrls: [ './set-create.component.css' ]
} )
export class SetCreateComponent implements OnInit {

  set: Set = new Set();

  constructor( public router: Router,
                private setService: SetService,
                public snackBar: MatSnackBar ) {
  }

  ngOnInit() {
  }

  createSet() {
    if ( this.set.setName == null ||
      this.set.setReference == null ||
      this.set.setFamily == null ) {

      this.openSnackBar( 'An error ocurred. Please review form data.',
        'Not saved' );
      return;
    } else {
      this.setService.save( this.set ).subscribe();
      this.openSnackBar( 'Set created.', 'Saved' );
      this.router.navigateByUrl( '/set-list' )
        .then( () => 
          this.router.navigate( ["/set-list"] )
        );
    }
  }

  openSnackBar( message: string, action: string ) {
    this.snackBar.open( message, action, {
      duration: 4000,
    } );
  }
}
