import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, OnDestroy {

  public navigation = {
    top: null,
    right: '/calendar',
    bottom: '/weather/tomorrow',
    left: '/'
  };

  public weather;

  public weatherSubscription;
  private weatherSubjectSubscription;

  constructor(private weatherService: WeatherService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    if(this.route.snapshot.data['weather'] == 'today') {
      this.navigation.top = '/weather/3days';
      this.navigation.bottom = '/weather/tomorrow';
    } else {
      this.navigation.top = '/weather/today';
      this.navigation.bottom = '/weather/3days';
    }

    this.weatherSubscription = this.weatherService.getWeather().subscribe(res => {
      if(this.route.snapshot.data['weather'] == 'today') {
        this.weather = res.list[0];
        this.weather.city = res.city;
      } else {
        this.weather = res.list[1];
        this.weather.city = res.city;
      }
    });
    this.weatherSubscription.unsubscribe();

    this.weatherSubjectSubscription = this.weatherService.getWeatherSubject().subscribe(res => {
      if(this.route.snapshot.data['weather'] == 'today') {
        this.weather = res.list[0];
        this.weather.city = res.city;
      } else {
        this.weather = res.list[1];
        this.weather.city = res.city;
      }
    });
  }

  ngOnDestroy () {
    this.weatherSubjectSubscription.unsubscribe();
  }

  onSwipeLeft() {
    if(this.navigation.right)
      this.router.navigate([this.navigation.right]);
  }

  onSwipeRight() {
    if(this.navigation.left)
    this.router.navigate([this.navigation.left]);
  }

  onSwipeUp() {
    if(this.navigation.bottom)
    this.router.navigate([this.navigation.bottom]);
  }

  onSwipeDown() {
    if(this.navigation.top)
    this.router.navigate([this.navigation.top]);
  }
}
