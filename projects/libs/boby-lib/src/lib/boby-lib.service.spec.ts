import { TestBed } from '@angular/core/testing';

import { BobyLibService } from './boby-lib.service';

describe('BobyLibService', () => {
  let service: BobyLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BobyLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
