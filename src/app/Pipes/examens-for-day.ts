import { ExamenModel } from './../Models/examen-model';
import { Pipe, PipeTransform } from '@angular/core';
 
@Pipe({
    name: 'examensForDay'
})
export class ExamensForDayPipe implements PipeTransform {
  transform(array: ExamenModel[], date: Date) {
      return array.filter( function(item){
        let src = new Date ( item.startTime.getFullYear(), item.startTime.getMonth(), item.startTime.getDate() );
        let inc = new Date ( date.getFullYear(), date.getMonth(), date.getDate());
        return +src == +inc;
      });
  }
}
