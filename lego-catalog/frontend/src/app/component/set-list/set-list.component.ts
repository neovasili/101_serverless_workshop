import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Set } from '../../model/set';
import { RouterExtService } from '../../service/app-routing.service'
import { SetService } from '../../service/set.service';

@Component( {
  selector: 'app-set-list',
  templateUrl: './set-list.component.html',
  styleUrls: [ './set-list.component.css' ]
} )
export class SetListComponent implements OnInit {

  sets: Set[];
  currentUrl: string;
  previousUrl: string;

  constructor( public router: Router,
                private routerService: RouterExtService,
                private setService: SetService ) {
  }
                
  ngOnInit() {
    this.getSets();
  }

  getSets(): void {
    if( this.routerService.getPreviousUrl() == '/' ) {
      this.setService.reloadUser();
    }
    this.setService.getUserSets()
      .subscribe( sets => {
        this.sets = sets;
      } );
  }
}
