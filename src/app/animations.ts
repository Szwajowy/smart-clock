import { trigger, state, transition, style, query, animateChild, group, animate } from '@angular/animations';

const animationDuration = '700ms';

export const slideInAnimation =

  trigger('routeAnimations', [
    transition('Clock => WeatherToday, Stopwatch => WeatherToday, Timer => WeatherToday, Alarms => WeatherToday, WeatherToday => Calendar, WeatherTomorrow => Calendar, WeatherThreeDays=>Calendar, Calendar => Settings, Settings => Clock', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        })
      ]),
      query(':enter', [
        style({ transform: 'translateX(100%)' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate(animationDuration+' ease-out', style({ transform: 'translateX(-100%)' }))
        ]),
        query(':enter', [
          animate(animationDuration+' ease-out', style({  transform: 'translateX(0%)'}))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('Clock => Settings, Settings => Calendar, Calendar => WeatherToday, WeatherToday => Clock, WeatherTomorrow => Clock, WeatherThreeDays => Clock', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        })
      ]),
      query(':enter', [
        style({ transform: 'translateX(-100%)' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate(animationDuration+' ease-out', style({ transform: 'translateX(100%)' }))
        ]),
        query(':enter', [
          animate(animationDuration+' ease-out', style({ transform: 'translateX(0%)' }))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('Clock => Stopwatch, Stopwatch => Timer, Timer => Alarms, Alarms => Clock, WeatherToday => WeatherTomorrow, WeatherTomorrow => WeatherThreeDays, WeatherThreeDays => WeatherToday', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        })
      ]),
      query(':enter', [
        style({ transform: 'translateY(100%)' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate(animationDuration+' ease-out', style({ transform: 'translateY(-100%)' }))
        ]),
        query(':enter', [
          animate(animationDuration+' ease-out', style({ transform: 'translateY(0%)' }))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('Alarms => Timer, Timer => Stopwatch, Stopwatch => Clock, Clock => Alarms, WeatherThreeDays => WeatherTomorrow, WeatherTomorrow => WeatherToday, WeatherToday => WeatherThreeDays', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        })
      ]),
      query(':enter', [
        style({ transform: 'translateY(-100%)' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate(animationDuration+' ease-out', style({ transform: 'translateY(100%)' }))
        ]),
        query(':enter', [
          animate(animationDuration+' ease-out', style({ transform: 'translateY(0%)' }))
        ])
      ]),
      query(':enter', animateChild()),
    ])
  ]);

export const notificationSlide = 
  trigger('nextNotification', [
    state('leave', style({
      position: 'absolute',
      top: '50%',
      left: '-100%',
      transform: 'translateY(-50%)',
      opacity: '0'
    })),
    state('active', style({
      position: 'absolute',
      top: '50%',
      left: '0',
      transform: 'translateY(-50%)',
      opacity: '100'
    })),
    state('enter', style({
      position: 'absolute',
      top: '50%',
      left: '100%',
      transform: 'translateY(-50%)',
      opacity: '0'
    })),
    transition('active => leave', [
      animate('0.5s ease')
    ]),
    transition('leave => active', [
      animate('0.5s ease')
    ]),
    transition('enter => active', [
      animate('0.5s ease')
    ]),
    transition('active => enter', [
      animate('0.5s ease')
    ])
  ]);