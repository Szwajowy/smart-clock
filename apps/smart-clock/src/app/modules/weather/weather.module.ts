import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedModule } from '../../shared/shared.module';
import { ChartComponent } from './components/chart/chart.component';
import { OneDayForecastComponent } from './pages/one-day-forecast/one-day-forecast.component';
import { ThreeDaysForecastComponent } from './pages/three-days-forecast/three-days-forecast.component';
import { WeatherRoutesModule } from './weather.routes';

import { WeatherService } from './weather.service';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    WeatherRoutesModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  providers: [WeatherService],
  declarations: [
    ChartComponent,
    OneDayForecastComponent,
    ThreeDaysForecastComponent,
  ],
  exports: [],
})
export class WeatherModule {}
