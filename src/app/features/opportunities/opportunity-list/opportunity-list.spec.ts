import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { OpportunityList } from './opportunity-list';

describe('OpportunityList', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [OpportunityList],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
  });

  afterEach(() => vi.useRealTimers());

  it('should wait the user stop typing before updating the search', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const component = TestBed.createComponent(OpportunityList).componentInstance;

    component.searchControl.setValue('o');
    component.searchControl.setValue('od');
    component.searchControl.setValue('odoo');
    vi.advanceTimersByTime(299);
    expect(navigate).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith([], {
      queryParams: { q: 'odoo', page: null },
      queryParamsHandling: 'merge',
    });
  });
});
