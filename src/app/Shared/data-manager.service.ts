import { ServiceJsonService } from './../service-json.service';
import { DisciplineModel } from './../discipline-model';
import { Injectable } from '@angular/core';

@Injectable()
export class DataManagerService {

  disciplines: DisciplineModel[] = new Array();


  constructor( private service: ServiceJsonService ) {
        console.log('Создание DataManager');
        this.loadDisciplines();
  }


    //  Дисциплины

    private loadDisciplines() {
        this.service.getDisciplinesAll()
            .then(data => {
               for (var i = 0; i < data.length; i++) {
                   let dscp = new DisciplineModel();
                   dscp.id = data[i].id;
                   dscp.title = data[i].title;
                   dscp.teacherId = data[i].teacherId;
                   dscp.active = data[i].active;
                   dscp.format = data[i].format;
                   this.disciplines.push( dscp );
               }
                console.log('DataManager: Получены дисциплины из сервиса');
            });
    }

    getDisciplinesAll() {
        return this.disciplines;
    }

    getDisciplineByID(id: string) {
        let index = this.disciplines.map(x => x.id).indexOf(id);
        return this.disciplines[index];
    }
}
