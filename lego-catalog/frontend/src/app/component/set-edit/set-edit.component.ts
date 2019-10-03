import { Component, OnInit } from '@angular/core';
import { Set } from '../../model/set';
import { SetService } from '../../service/set.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component( {
  selector: 'app-set-edit',
  templateUrl: './set-edit.component.html',
  styleUrls: [ './set-edit.component.css' ]
} )
export class SetEditComponent implements OnInit {

	setReference: string;
  set: Set = new Set();
  sub: any;

  constructor( public router: Router,
                private route: ActivatedRoute,
                private setService: SetService,
                public snackBar: MatSnackBar ) {
    this.sub = this.route.params.subscribe( params => {
      this.setReference = params[ 'setReference' ];
      this.setService.getSet( this.setReference )
        .subscribe( set => {
          this.set.setName = set.setName;
          this.set.setReference = set.setReference;
          this.set.setFamily = set.setFamily;
          this.set.setQuantity = set.setQuantity;
          this.set.setAge = set.setAge;
          this.set.setParts = set.setParts;
          this.set.setBuild = set.setBuild;
          this.set.setDefaultImage = set.setDefaultImage;
        } );
    } );
  }

  ngOnInit() {
  }

  editSet() {
    if ( this.set.setName == null ||
      this.set.setReference == null ||
      this.set.setFamily == null ) {

      this.openSnackBar( 'An error ocurred. Please review form data.',
        'Not saved' );
      return;
    } else {

      this.setService.updateSet( this.set, this.set.setReference ).subscribe();
      this.openSnackBar( 'Set Updated.', 'Saved' );
      this.router.navigateByUrl( '/set-detail/' + this.set.setReference )
        .then( () => 
          this.router.navigate( ["/set-detail"] )
        );
    }
  }

  openSnackBar( message: string, action: string ) {
    this.snackBar.open( message, action, {
      duration: 4000,
    } );
  }
}
