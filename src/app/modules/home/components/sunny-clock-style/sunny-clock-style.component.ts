import { Component, Input, ViewChild, OnInit, OnDestroy } from "@angular/core";
import { interval, Subscription } from "rxjs";
import { ClockService } from "../../clock.service";

@Component({
  selector: "app-sunny-clock",
  templateUrl: "./sunny-clock-style.component.html",
  styleUrls: ["./sunny-clock-style.component.scss"],
})
export class SunnyStyleClockComponent implements OnInit, OnDestroy {
  @Input() time;
  @Input() timezone;
  @Input() weather;

  @ViewChild("sun", { static: true }) sun;
  @ViewChild("container", { static: true }) container;

  private refresh$ = interval(15000);
  private refreshSubscription: Subscription;

  constructor(private clockService: ClockService) {}

  ngOnInit() {
    this.animate();
    this.refreshSubscription = this.refresh$.subscribe(() => {
      this.animate();
    });
  }

  ngOnDestroy() {
    this.refreshSubscription.unsubscribe();
  }

  private animate() {
    let startPosition = -54;

    if (this.weather) {
      let sunrise = new Date(this.weather.city.sunrise * 1000);
      let sunriseInMinutes = sunrise.getHours() * 60 + sunrise.getMinutes();
      let sunset = new Date(this.weather.city.sunset * 1000);

      let diff = new Date(
        sunset.getTime() - sunrise.getTime() - 1000 * 60 * 60
      );
      let diffInMinutes = diff.getHours() * 60 + diff.getMinutes();
      let degPerMinute = 108 / diffInMinutes;

      let moveTime =
        (this.time.getHours() + (this.timezone ? this.timezone : 0)) * 60 +
        this.time.getMinutes() -
        sunriseInMinutes;

      // Jezeli moveTime < diffInMinutes/2 to znaczy ze jest przed poludniem
      // Jezeli diffInMinutes/2 < moveTime < diffInMinutes to znaczy ze jest po poludniu
      // Jezeli diffInMinutes < moveTime to znaczy ze jest po zachodzie

      if (moveTime < diffInMinutes / 2 - 120 && moveTime > 0) {
        this.container.nativeElement.style.backgroundColor = "#32508c";
      } else if (moveTime < diffInMinutes / 2 + 120 && moveTime > 0) {
        this.container.nativeElement.style.backgroundColor = "#4978be";
      } else if (moveTime < diffInMinutes && moveTime > 0) {
        this.container.nativeElement.style.backgroundColor = "#32508c";
      } else {
        this.container.nativeElement.style.backgroundColor = "#1f366a";
      }

      this.sun.nativeElement.style.transform = `rotate(${
        startPosition + moveTime * degPerMinute
      }deg)`;
    } else {
      this.container.nativeElement.style.backgroundColor = "#4978be";
      this.sun.nativeElement.style.transform = `rotate(0deg)`;
    }
  }
}
