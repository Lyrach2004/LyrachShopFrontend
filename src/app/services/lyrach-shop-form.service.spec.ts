import { TestBed } from '@angular/core/testing';

import { LyrachShopFormService } from './lyrach-shop-form.service';

describe('LyrachShopFormService', () => {
  let service: LyrachShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LyrachShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
