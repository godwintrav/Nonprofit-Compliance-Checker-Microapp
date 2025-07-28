import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryEntry } from './history-entry';

describe('HistoryEntry', () => {
  let component: HistoryEntry;
  let fixture: ComponentFixture<HistoryEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
