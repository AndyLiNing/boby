import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BobyLibModule } from '../../../../libs/boby-lib/src/lib';

import { tokenInterceptorProviders } from "./token/token-interceptor.provider";
import { TEST } from "./token/token.config";
import { AboutComponent } from "./about/about.component";
import {HomeComponent} from "./home/home.component";
const a = TEST;

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BobyLibModule
  ],
  // providers: [tokenInterceptorProviders],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }
