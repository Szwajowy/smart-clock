import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NavArrowButtonComponent } from "./nav-arrow-button.component";

describe("NavArrowButtonComponent", () => {
  let component: NavArrowButtonComponent;
  let fixture: ComponentFixture<NavArrowButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavArrowButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavArrowButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
