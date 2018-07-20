import { Pipe, PipeTransform } from '@angular/core';
import { ExamenRowModel } from 'app/Models/examen-list-model';
 
@Pipe({
    name: 'examensRowOrder'
})
export class ExamensRowOrderPipe implements PipeTransform {
  transform(array: ExamenRowModel[]) {
    return array.sort( function(a,b){
        return a.parentExamen.startTime > b.parentExamen.startTime ? 1 : -1;
        });
    }
}
