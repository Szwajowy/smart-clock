import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dateAgo",
})
export class DateAgoPipe implements PipeTransform {
  transform(value: number): string {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);

      // if (seconds < 29)
      //   return "właśnie teraz";

      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
      };
      const translations = {
        year: ["rok", "lata", "lat"],
        month: ["miesiąc", "miesiące", "miesięcy"],
        week: ["tydzień", "tygodnie", "tygodni"],
        day: ["dzień", "dni", "dni"],
        hour: ["godzinę", "godziny", "godzin"],
        minute: ["minutę", "minuty", "minut"],
        second: ["sekundę", "sekundy", "sekund"],
      };

      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0)
          if (counter === 1) {
            return translations[i][0] + " temu"; // singular (1 day ago)
          } else {
            switch (counter) {
              case 2:
              case 3:
              case 4:
                return counter + " " + translations[i][1] + " temu";
              default:
                return counter + " " + translations[i][2] + " temu";
            }
          }
      }
    }
    return value.toString();
  }
}
