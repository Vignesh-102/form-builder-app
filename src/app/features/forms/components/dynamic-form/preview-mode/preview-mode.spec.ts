import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMode } from './preview-mode';

describe('PreviewMode', () => {
  let component: PreviewMode;
  let fixture: ComponentFixture<PreviewMode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewMode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewMode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
