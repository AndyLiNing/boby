import {Component, OnDestroy, OnInit} from '@angular/core';
import {RootProvidedService} from "../root-provided.service";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private rootProvidedService: RootProvidedService) { }

  ngOnInit() {
    this.rootProvidedService.req().subscribe((res) => {
      console.warn('Http req', res);
    });
    this.rootProvidedService.longRunObs()
      // .subscribe((res) => {
      //   console.warn('longRunObs', res);
      // });
  }

  ngOnDestroy() {
    console.warn('HomeComponent ngOnDestroy')
  }

}

