import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourismDetail } from './tourism-detail';

describe('TourismDetail', () => {
  let component: TourismDetail;
  let fixture: ComponentFixture<TourismDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourismDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(TourismDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
