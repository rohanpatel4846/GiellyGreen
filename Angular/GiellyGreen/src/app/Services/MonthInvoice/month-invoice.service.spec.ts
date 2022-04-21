import { TestBed } from '@angular/core/testing';

import { MonthInvoiceService } from './month-invoice.service';

describe('MonthInvoiceService', () => {
  let service: MonthInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonthInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
