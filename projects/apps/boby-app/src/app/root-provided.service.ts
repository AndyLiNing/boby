import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {interval, of} from 'rxjs';
import {delay, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RootProvidedService {
  constructor(private httpClient: HttpClient) {}

  req() {
    return this.httpClient.get('https://jsonplaceholder.typicode.com/todos/1').pipe(delay(5000));
  }

  longRunObs() {
    return interval(1000);
  }
}
