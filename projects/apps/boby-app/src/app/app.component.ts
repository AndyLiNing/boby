import {Component, OnDestroy, OnInit} from '@angular/core';
import {TokenService} from "./token/token.service";
import {TEST} from "./token/token.config";
import {RootProvidedService} from "./root-provided.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'boby-app';

  constructor(private tokenService: TokenService, private appService: RootProvidedService) {
    // this.tokenService.init();
  }

  ngOnInit() {

    // const a = TEST;
    // this.tokenService.accessToken$.subscribe((data) => {
    //   console.log('First ngOnInit', data)
    // });
    // this.tokenService.accessToken$.subscribe((data) => {
    //   console.log('Second ngOnInit', data)
    // });
    // setTimeout(() => {
    //   this.tokenService.accessToken$.subscribe((data) => {
    //     console.log('setTimeout 2 seconds', data)
    //   });
    // }, 2000);
    // setTimeout(() => {
    //   this.tokenService.accessToken$.subscribe((data) => {
    //     console.log('setTimeout 11 seconds', data)
    //   });
    // }, 11000)
  }

  onRequest(){
    this.tokenService.accessToken$.subscribe((data) => {
      console.log('onRequest', data)
    });
  }

  ngOnDestroy() {
    console.log('ngOnDestroy AppComponent');
  }

}
