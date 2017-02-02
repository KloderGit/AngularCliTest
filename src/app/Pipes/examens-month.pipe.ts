import { ExamenModel } from './../Models/examen-model';
import { Pipe, PipeTransform } from '@angular/core';
 
@Pipe({
    name: 'examensForMonth'
})
export class ExamensForMonthPipe implements PipeTransform {
  transform(array: ExamenModel[], timestamp: number) {
    let tempDate = new Date (timestamp);
    return array.filter( function(item){
      return (item.startTime.getFullYear() == tempDate.getFullYear()) && (item.startTime.getMonth() == tempDate.getMonth());
    });
  }
}