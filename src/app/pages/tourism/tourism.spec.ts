import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tourism } from './tourism';

describe('Tourism', () => {
  let component: Tourism;
  let fixture: ComponentFixture<Tourism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tourism],
    }).compileComponents();

    fixture = TestBed.createComponent(Tourism);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
