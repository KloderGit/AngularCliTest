import { TeacherModel } from './../Models/teacher-model';
import { ServiceJsonService } from './../Services/service-json.service';
import { DisciplineModel } from './../Models/discipline-model';

import { Injectable } from '@angular/core';

@Injectable()
export class DataManagerService {

  disciplines: DisciplineModel[] = new Array();
  teachers: TeacherModel[] = new Array();


  constructor( private service: ServiceJsonService ) {
        console.log('Создание DataManager');
        this.loadDisciplines();
        this.loadTeachers();
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


    private loadTeachers() {
        this.service.getTeachersAll()
            .then(data => {
               for (var i = 0; i < data.length; i++) {
                   let thr = new TeacherModel();
                   thr.id = data[i].id;
                   thr.name = data[i].name;
                   this.teachers.push( thr );
               }
                console.log('DataManager: Получены преподаатели из сервиса', this.teachers)
            });
    }

    getTeachersAll() {
        return this.teachers;
    }

    getTeacherById( id: string ) {
        return this.teachers[ this.teachers.map( item => item.id ).indexOf(id) ];
    }        
}
