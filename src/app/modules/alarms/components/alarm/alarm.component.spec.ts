import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MockProvider } from "ng-mocks";

import { Alarm } from "@shared/models/alarm.model";
import { AlarmsService } from "../../alarms.service";
import { AlarmComponent } from "./alarm.component";

describe("AlarmComponent", () => {
  let component: AlarmComponent;
  let fixture: ComponentFixture<AlarmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AlarmComponent],
      providers: [MockProvider(AlarmsService, { editedAlarm: new Alarm() })],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
