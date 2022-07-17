import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceitComponent } from './placeit.component';

describe('PlaceitComponent', () => {
  let component: PlaceitComponent;
  let fixture: ComponentFixture<PlaceitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
