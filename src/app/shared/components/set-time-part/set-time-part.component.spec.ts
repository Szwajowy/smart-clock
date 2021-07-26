import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SetTimePartComponent } from './set-time-part.component';

describe('SetTimePartComponent', () => {
  let component: SetTimePartComponent;
  let fixture: ComponentFixture<SetTimePartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SetTimePartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetTimePartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
