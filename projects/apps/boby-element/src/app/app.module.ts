import {DoBootstrap, Injector, ModuleWithProviders, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { createCustomElement } from '@angular/elements';
import { BobyLibComponent, BobyLibModule } from '../../../../libs/boby-lib/src/lib';



@NgModule({
  declarations: [],
  imports: [BrowserModule, BobyLibModule],
})
export class AppModule implements DoBootstrap {

  static forRoot(params: any): ModuleWithProviders<any> {
    return {
      ngModule: AppModule,
      providers: []
    };
  }

  constructor(private injector: Injector) {}

  ngDoBootstrap()
  {
    const element = createCustomElement( BobyLibComponent, {injector: this.injector })
    customElements.define('xxx-boby', element)
  }
}
