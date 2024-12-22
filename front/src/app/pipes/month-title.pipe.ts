import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthTitle'
})
export class MonthTitlePipe implements PipeTransform {

  private monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  transform(month: number): string {
    if (month >= 1 && month <= 12) {
      return this.monthNames[month - 1];
    }
    return 'Invalid Month';
  }

}
