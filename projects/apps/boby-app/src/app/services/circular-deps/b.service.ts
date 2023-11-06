import { Injectable } from '@angular/core';

import { AService } from './a.service';

@Injectable({
  providedIn: 'root'
})

export class BService {
  constructor(private aService : AService  ) {
  }
}
