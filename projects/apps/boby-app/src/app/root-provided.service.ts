import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { interval } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RootProvidedService {
  constructor(private httpClient: HttpClient) {}

  req() {
    return this.httpClient.get('https://jsonplaceholder.typicode.com/todos/1').pipe(delay(5000));
  }

  // Note: Example to create a memory leak when don't unsubscribe long-run obs
  longRunObs() {
    return interval(1000);
  }
}
