import { TestBed } from '@angular/core/testing';

import { NavparamService } from './navparam.service';

describe('NavparamService', () => {
  let service: NavparamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavparamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
