import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, inject, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BobyLibModule } from '../../../../libs/boby-lib/src/lib';

import { tokenInterceptorProviders } from "./token/token-interceptor.provider";
import { TEST } from "./token/token.config";
import { AboutComponent } from "./about/about.component";
import {HomeComponent} from "./home/home.component";
import { ErrorHandlerService } from './services/error-handler/error-handler.service';
const a = TEST;

// import { AnimalClass } from '../../../../libs/boby-lib/src/circular/animal.class'
// import { DogClass } from '../../../../libs/boby-lib/src/circular/dog.class'

import { AnimalClass, DogClass } from '../../../../libs/boby-lib/src/circular/internal';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // AppRoutingModule,
    BobyLibModule
  ],
  // providers: [tokenInterceptorProviders],
  providers: [
    {provide: ErrorHandler, useClass: ErrorHandlerService}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule {

  constructor(private errorHandlerService: ErrorHandlerService) {
    // const animal = new AnimalClass('animal', 0)
   const dog = new DogClass('dog', 2)
  }
}
