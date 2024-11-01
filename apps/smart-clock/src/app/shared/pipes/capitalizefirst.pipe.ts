import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "capitalizefirst",
})
export class CapitalizefirstPipe implements PipeTransform {
  transform(value: string): string {
    if (value === null) return "Not assigned";

    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
