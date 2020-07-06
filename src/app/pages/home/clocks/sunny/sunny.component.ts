import { Component, Input, ViewChild, OnInit } from "@angular/core";
import { ClockService } from "@shared/services/clock.service";

@Component({
  selector: "app-sunny-clock",
  templateUrl: "./sunny.component.html",
  styleUrls: ["./sunny.component.scss"],
})
export class SunnyComponent implements OnInit {
  @Input() time;
  @Input() timezone;
  @Input() weather;

  @ViewChild("sun", { static: true }) sun;
  @ViewChild("container", { static: true }) container;

  constructor(private clockService: ClockService) {}

  ngOnInit() {
    this.animate();
    setInterval(() => {
      this.animate();
    }, 15000);
  }

  private animate() {
    console.log("animating");
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
