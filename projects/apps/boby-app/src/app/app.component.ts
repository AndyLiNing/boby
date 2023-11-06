import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  concat,
  concatMap,
  EMPTY,
  last,
  map,
  Observable,
  of, ReplaySubject,
  scan,
  startWith,
  take,
  tap,
  zip
} from 'rxjs';
import { TokenService } from "./token/token.service";
import { RootProvidedService } from "./root-provided.service";
import { AService } from './services/circular-deps/a.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // providers: [
  //   {provide: ErrorHandler, useClass: ErrorHandlerService}
  // ],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'boby-app';


  posts$$ = new BehaviorSubject<any>([])
  posts$: Observable<any> = this.posts$$.asObservable();
  uni = 1;
  constructor(private tokenService: TokenService, private appService: RootProvidedService, private httpClient: HttpClient) {
    // this.tokenService.init();
    // console.log('AppComponent constructor')
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

  onLoadMore() {
    console.log('onLoadMore')

    this.loadMore().pipe(take(1),
      map((data) => {
        // @ts-ignore
        data['uni'] =  this.uni++
        return data
      })).subscribe(
      (data) => {
        console.log('data', data)
        console.log('this.posts$$.getValue()', this.posts$$.getValue())
        if (this.posts$$.getValue().length) {
          return this.posts$$.next([...this.posts$$.getValue(),data])
        }
        this.posts$$.next([data])
      }
    )
  }

  loadMore() {
    return this.httpClient.get<Record<string, any>[]>('https://jsonplaceholder.typicode.com/posts/1')
  }

  ngOnDestroy() {
    console.log('ngOnDestroy AppComponent');
  }

}
