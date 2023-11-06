import { Injectable } from '@angular/core';

import { BService } from './b.service';

@Injectable({
  providedIn: 'root'
})

export class AService {
  constructor(private bService: BService ) {
  }
}
