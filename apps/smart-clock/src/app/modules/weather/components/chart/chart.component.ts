import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { ThemeService } from '../../../../core/services/theme.service';
import { WeatherService } from '../../weather.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnDestroy {
  private subs = new Subscription();

  public todayWeatherFull$;

  private changeBrightnessBy = 25;

  isLoading = false;
  options = {
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: [
          '0:00',
          '3:00',
          '6:00',
          '9:00',
          '12:00',
          '15:00',
          '18:00',
          '21:00',
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
        type: 'value',
        show: true,
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
          formatter: '{value}mm',
          color: 'rgba(0,0,0,0.8)',
          fontSize: 10,
          showMinLabel: false,
          showMaxLabel: false,
        },
      },
    ],
    series: [
      {
        name: 'min-temp',
        type: 'line',
        color: 'rgba(0,0,0,0.8)',
        showSymbol: false,
        areaStyle: {
          color: 'rgba(0,0,0,0.6)',
        },
        smooth: true,
        data: [],
      },
    ],
  };
  updateOptions: { [key: string]: unknown };

  constructor(
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private weatherService: WeatherService,
  ) {
    this.todayWeatherFull$ = this.weatherService.getWeather();
  }

  ngOnInit() {
    this.subs.add(
      this.todayWeatherFull$.subscribe((weather) => {
        const xValues = [];
        const yValues = [];
        if (this.route.snapshot.data['weather'] == 'today') {
          for (let i = 0; i < 9; i++) {
            xValues.push(weather.list[i].dt_txt.slice(11, 16));
            yValues.push(
              weather.list[i].rain ? Math.round(weather.list[i].rain['3h']) : 0,
            );
          }
        } else {
          for (let i = 8; i < 17; i++) {
            xValues.push(weather.list[i].dt_txt.slice(11, 16));
            yValues.push(
              weather.list[i].rain ? Math.round(weather.list[i].rain['3h']) : 0,
            );
          }
        }

        this.options.xAxis[0].data = xValues;
        this.options.series[0].data = yValues;

        let color = getComputedStyle(document.documentElement).getPropertyValue(
          '--color',
        );

        if (color[0] === ' ') color = color.slice(1);

        this.updateOptions = {
          yAxis: {
            axisLabel: {
              color: this.convertToRGBA(
                this.adjustBrightnessOfColor(
                  color,
                  this.isColorDark(color) === 'dark'
                    ? this.changeBrightnessBy
                    : -this.changeBrightnessBy,
                ),
                1,
              ),
            },
          },
          xAxis: {
            data: xValues,
            axisLabel: {
              color: this.convertToRGBA(
                this.adjustBrightnessOfColor(
                  color,
                  this.isColorDark(color) === 'dark'
                    ? this.changeBrightnessBy
                    : -this.changeBrightnessBy,
                ),
                1,
              ),
            },
          },
          series: [
            {
              data: yValues,
              color: this.convertToRGBA(
                this.adjustBrightnessOfColor(
                  color,
                  this.isColorDark(color) === 'dark'
                    ? this.changeBrightnessBy
                    : -this.changeBrightnessBy,
                ),
                0.9,
              ),
              areaStyle: {
                color: this.convertToRGBA(
                  this.adjustBrightnessOfColor(
                    color,
                    this.isColorDark(color) === 'dark'
                      ? this.changeBrightnessBy
                      : -this.changeBrightnessBy,
                  ),
                  0.8,
                ),
              },
            },
          ],
        };
      }),
    );

    this.subs.add(
      this.themeService.activeTheme$.subscribe(() => {
        let color = getComputedStyle(document.documentElement).getPropertyValue(
          '--color',
        );

        if (color[0] === ' ') color = color.slice(1);

        this.updateOptions = {
          yAxis: {
            axisLabel: {
              color: this.convertToRGBA(
                this.adjustBrightnessOfColor(
                  color,
                  this.isColorDark(color) === 'dark'
                    ? this.changeBrightnessBy
                    : -this.changeBrightnessBy,
                ),
                1,
              ),
            },
          },
          xAxis: {
            axisLabel: {
              color: this.convertToRGBA(
                this.adjustBrightnessOfColor(
                  color,
                  this.isColorDark(color) === 'dark'
                    ? this.changeBrightnessBy
                    : -this.changeBrightnessBy,
                ),
                1,
              ),
            },
          },
          series: [
            {
              color: this.convertToRGBA(
                this.adjustBrightnessOfColor(
                  color,
                  this.isColorDark(color) === 'dark'
                    ? this.changeBrightnessBy
                    : -this.changeBrightnessBy,
                ),
                0.9,
              ),
              areaStyle: {
                color: this.convertToRGBA(
                  this.adjustBrightnessOfColor(
                    color,
                    this.isColorDark(color) === 'dark'
                      ? this.changeBrightnessBy
                      : -this.changeBrightnessBy,
                  ),
                  0.8,
                ),
              },
            },
          ],
        };
      }),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  isHexColorValid(hex) {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }

    return hex;
  }

  isColorDark(hex) {
    hex = this.isHexColorValid(hex);
    const r: number = parseInt(hex.slice(0, 2), 16),
      g: number = parseInt(hex.slice(2, 4), 16),
      b: number = parseInt(hex.slice(4, 6), 16);

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luma > 128 ? 'bright' : 'dark';
  }

  private adjustBrightnessOfColor(hex, value) {
    hex = this.isHexColorValid(hex);
    // invert color components
    let r: number = parseInt(hex.slice(0, 2), 16),
      g: number = parseInt(hex.slice(2, 4), 16),
      b: number = parseInt(hex.slice(4, 6), 16);
    let rs: string, gs: string, bs: string;

    if (value === 0) {
      rs = r.toString(16);
      gs = g.toString(16);
      bs = b.toString(16);
      return '#' + this.padZero(rs) + this.padZero(gs) + this.padZero(bs);
    } else if (value > 0) {
      if (r > 255 - value || g > 255 - value || b > 255 - value) {
        return '#FFFFFF';
      }
    } else {
      if (r <= -value || g <= -value || b <= -value) {
        return '#000000';
      }
    }

    r = (r + value).toString(16);
    g = (g + value).toString(16);
    b = (b + value).toString(16);

    // pad each with zeros and return
    return '#' + this.padZero(r) + this.padZero(g) + this.padZero(b);
  }

  private convertToRGBA(hex, opacity) {
    hex = this.isHexColorValid(hex);

    if (opacity < 0 || opacity > 1) {
      throw new Error('Invalid opacity.');
    }

    // convert color components
    const r = parseInt(hex.slice(0, 2), 16).toString(),
      g = parseInt(hex.slice(2, 4), 16).toString(),
      b = parseInt(hex.slice(4, 6), 16).toString();

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  private padZero(str, len?) {
    len = len || 2;
    const zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }
}
