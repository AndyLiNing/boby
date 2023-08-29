import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn:'root'
})
export class ErrorHandlerService implements ErrorHandler {

  constructor() {
    console.log('ErrorHandlerService constructor' )
  }

  handleError(error: any): void {
    //console.log('error',error)
    throw(error)
  }

}
