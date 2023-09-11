import { TestBed } from '@angular/core/testing';

import { ConsatisfactionService } from './consatisfaction.service';

describe('ConsatisfactionServiceService', () => {
  let service: ConsatisfactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsatisfactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
