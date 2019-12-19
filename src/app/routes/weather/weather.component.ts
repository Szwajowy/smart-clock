import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WeatherService } from 'src/app/weather.service';

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

  public weatherSubscription;
  public weather;

  constructor(private weatherService: WeatherService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    if(this.route.snapshot.data['weather'] == 'today') {
      this.navigation.top = null;
      this.navigation.bottom = '/weather/tomorrow';
    } else {
      this.navigation.top = '/weather/today';
      this.navigation.bottom = null;
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
  }

  ngOnDestroy () {
    this.weatherSubscription.unsubscribe();
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
