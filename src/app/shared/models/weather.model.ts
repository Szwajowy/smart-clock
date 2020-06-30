export class Weather {
  public cod: string;
  public message: number;
  public cnt: number;
  public list: [
    {
      dt: number;
      main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        sea_level: number;
        grnd_level: number;
        humidity: number;
        temp_kf: number;
      };
      weather: [
        {
          id: number;
          main: string;
          description: string;
          icon: string;
        }
      ];
      clouds: {
        all: string;
      };
      wind: {
        speed: number;
        deg: number;
      };
      rain?: {
        "3h": number;
      };
      snow?: {
        "3h": number;
      };
      sys: {
        pod: string;
      };
      dt_txt: string;
    }
  ];
  public city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
  public updatedAt: number;

  constructor(weather: {
    cod: string;
    message: number;
    cnt: number;
    list: [
      {
        dt: number;
        main: {
          temp: number;
          feels_like: number;
          temp_min: number;
          temp_max: number;
          pressure: number;
          sea_level: number;
          grnd_level: number;
          humidity: number;
          temp_kf: number;
        };
        weather: [
          {
            id: number;
            main: string;
            description: string;
            icon: string;
          }
        ];
        clouds: {
          all: string;
        };
        wind: {
          speed: number;
          deg: number;
        };
        rain?: {
          "3h": number;
        };
        snow?: {
          "3h": number;
        };
        sys: {
          pod: string;
        };
        dt_txt: string;
      }
    ];
    city: {
      id: number;
      name: string;
      coord: {
        lat: number;
        lon: number;
      };
      country: string;
      timezone: number;
      sunrise: number;
      sunset: number;
    };
    updatedAt: number;
  }) {
    this.cod = weather.cod;
    this.message = weather.message;
    this.cnt = weather.cnt;
    this.list = weather.list;
    this.city = weather.city;
    this.updatedAt = weather.updatedAt;
  }

  isUpdated(time: number) {
    let now = new Date().getTime();
    if (this.updatedAt < now - time) return false;

    return true;
  }
}
