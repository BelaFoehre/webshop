import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: NgxResetPasswordComponent;
  let fixture: ComponentFixture<NgxResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxResetPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
