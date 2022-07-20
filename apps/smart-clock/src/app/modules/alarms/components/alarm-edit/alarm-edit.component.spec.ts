import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Alarm } from "@shared/models/alarm.model";
import { MockProvider } from "ng-mocks";

import { AlarmsService } from "../../alarms.service";
import { AlarmEditComponent } from "./alarm-edit.component";

describe("AlarmEditComponent", () => {
  let component: AlarmEditComponent;
  let fixture: ComponentFixture<AlarmEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AlarmEditComponent],
      providers: [MockProvider(AlarmsService, { editedAlarm: new Alarm() })],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
