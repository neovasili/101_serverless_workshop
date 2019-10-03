import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Set } from '../../model/set';
import { SetService } from '../../service/set.service';

@Component( {
	selector: 'app-set-detail',
	templateUrl: './set-detail.component.html',
	styleUrls: [ './set-detail.component.css' ]
} )
export class SetDetailComponent implements OnInit {

	setReference: string;
	selectedSet: Set = new Set();
	sub: any;

	constructor( public router: Router,
				private route: ActivatedRoute,
				private setService: SetService ) {

		this.sub = this.route.params.subscribe( params => {
			this.setReference = params[ 'setReference' ];
			this.setService.getSet( this.setReference )
				.subscribe( set => {
					this.selectedSet.setName = set.setName;
					this.selectedSet.setReference = set.setReference;
					this.selectedSet.setFamily = set.setFamily;
					this.selectedSet.setQuantity = set.setQuantity;
					this.selectedSet.setAge = set.setAge;
					this.selectedSet.setParts = set.setParts;
					this.selectedSet.setBuild = set.setBuild;
					this.selectedSet.setDefaultImage = set.setDefaultImage;
				} );
		} );
	}

	ngOnInit() {
	}

	deleteSet() {

		if ( window.confirm( 'Are sure you want to delete this item ?' ) ) {
				
	    	this.setService.delete( this.setReference ).subscribe( (data) =>{
					console.log( "success" );
				});
			this.router.navigateByUrl( '/set-list', {skipLocationChange: true} )
				.then( () =>
					this.router.navigate( ["/set-list"] )
				);
		}
	}
}
