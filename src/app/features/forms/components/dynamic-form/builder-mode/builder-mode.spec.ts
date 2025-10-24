import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderMode } from './builder-mode';

describe('BuilderMode', () => {
  let component: BuilderMode;
  let fixture: ComponentFixture<BuilderMode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderMode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderMode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
