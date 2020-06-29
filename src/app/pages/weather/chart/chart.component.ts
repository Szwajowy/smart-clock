import { Component, OnInit, OnDestroy } from "@angular/core";
import { WeatherService } from "@shared/services/weather.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"],
})
export class ChartComponent implements OnInit, OnDestroy {
  private weatherSubscription;

  public todayWeatherFull$ = this.weatherService.getWeather();

  isLoading = false;
  options = {
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: [
          "0:00",
          "3:00",
          "6:00",
          "9:00",
          "12:00",
          "15:00",
          "18:00",
          "21:00",
        ],
        show: true,
        axisLine: {
          show: false,
          onZero: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          inside: true,
          showMinLabel: false,
          showMaxLabel: false,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        show: true,
        interval: 10,
        axisLine: {
          show: false,
          onZero: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          inside: true,
          color: "rgba(0,0,0,0.8)",
          showMinLabel: false,
          showMaxLabel: false,
        },
      },
    ],
    series: [
      {
        name: "min-temp",
        type: "line",
        color: "rgba(0,0,0,0.8)",
        showSymbol: false,
        areaStyle: {
          color: "rgba(0,0,0,0.6)",
        },
        smooth: true,
        data: [],
      },
    ],
  };
  updateOptions: any;

  constructor(
    private route: ActivatedRoute,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    this.weatherSubscription = this.todayWeatherFull$.subscribe((weather) => {
      let xValues = [];
      let yValues = [];
      if (this.route.snapshot.data["weather"] == "today") {
        for (let i = 0; i < 9; i++) {
          xValues.push(weather.list[i].dt_txt.slice(11, 16));
          yValues.push(
            weather.list[i].rain
              ? Math.round(weather.list[i].rain["3h"] * 100)
              : 0
          );
        }
      } else {
        for (let i = 9; i < 18; i++) {
          xValues.push(weather.list[i].dt_txt.slice(11, 16));
          yValues.push(
            weather.list[i].rain
              ? Math.round(weather.list[i].rain["3h"] * 100)
              : 0
          );
        }
      }

      this.options.xAxis[0].data = xValues;
      this.options.series[0].data = yValues;

      let color = getComputedStyle(document.documentElement).getPropertyValue(
        "--color"
      );

      if (color[0] === " ") color = color.slice(1);

      this.updateOptions = {
        yAxis: {
          axisLabel: {
            color: this.convertToRGBA(color, 0.8),
          },
        },
        xAxis: {
          data: xValues,
          axisLabel: {
            color: this.convertToRGBA(color, 0.8),
          },
        },
        series: [
          {
            data: yValues,
            color: this.convertToRGBA(this.invertColor(color), 0.8),
            areaStyle: {
              color: this.convertToRGBA(this.invertColor(color), 0.6),
            },
          },
        ],
      };
    });
  }

  ngOnDestroy() {
    this.weatherSubscription.unsubscribe();
  }

  private invertColor(hex) {
    if (hex.indexOf("#") === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error("Invalid HEX color.");
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
      g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
      b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return "#" + this.padZero(r) + this.padZero(g) + this.padZero(b);
  }

  private convertToRGBA(hex, opacity) {
    if (hex.indexOf("#") === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error("Invalid HEX color.");
    }

    if (opacity < 0 || opacity > 1) {
      throw new Error("Invalid opacity.");
    }

    // convert color components
    var r = parseInt(hex.slice(0, 2), 16).toString(),
      g = parseInt(hex.slice(2, 4), 16).toString(),
      b = parseInt(hex.slice(4, 6), 16).toString();

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  private padZero(str, len?) {
    len = len || 2;
    var zeros = new Array(len).join("0");
    return (zeros + str).slice(-len);
  }
}
