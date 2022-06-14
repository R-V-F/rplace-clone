import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushesComponent } from './brushes.component';

describe('BrushesComponent', () => {
  let component: BrushesComponent;
  let fixture: ComponentFixture<BrushesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrushesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrushesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
