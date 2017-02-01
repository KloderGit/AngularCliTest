/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServiceJsonService } from './service-json.service';

describe('ServiceJsonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceJsonService]
    });
  });

  it('should ...', inject([ServiceJsonService], (service: ServiceJsonService) => {
    expect(service).toBeTruthy();
  }));
});
