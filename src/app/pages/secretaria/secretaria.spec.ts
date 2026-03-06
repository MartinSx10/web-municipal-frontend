import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Secretaria } from './secretaria';

describe('Secretaria', () => {
  let component: Secretaria;
  let fixture: ComponentFixture<Secretaria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Secretaria],
    }).compileComponents();

    fixture = TestBed.createComponent(Secretaria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
