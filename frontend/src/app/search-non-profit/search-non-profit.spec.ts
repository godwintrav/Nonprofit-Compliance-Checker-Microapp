import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNonProfit } from './search-non-profit';

describe('SearchNonProfit', () => {
  let component: SearchNonProfit;
  let fixture: ComponentFixture<SearchNonProfit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchNonProfit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchNonProfit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
