import { TestBed } from '@angular/core/testing';

import { EventemitterService } from './eventemitter.service';

describe('EventemitterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventemitterService = TestBed.get(EventemitterService);
    expect(service).toBeTruthy();
  });
});
