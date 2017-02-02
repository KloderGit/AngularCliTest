import { ExamenModel } from './../Models/examen-model';
import { TeacherModel } from './../Models/teacher-model';
import { ServiceJsonService } from './../Services/service-json.service';
import { DisciplineModel } from './../Models/discipline-model';

import { Injectable } from '@angular/core';

@Injectable()
export class DataManagerService {

  disciplines: DisciplineModel[] = new Array();
  teachers: TeacherModel[] = new Array();
  examens: ExamenModel[] = new Array();

  monthLoadedTabel: { disciplineID: string, year: number, month: number }[] = [];

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
                console.log('DataManager: Получены преподаатели из сервиса')
            });
    }

    getTeachersAll() {
        return this.teachers;
    }

    getTeacherById( id: string ) {
        return this.teachers[ this.teachers.map( item => item.id ).indexOf(id) ];
    }


    //  Реестр загруженных месяцев

    getLoadedMonth( disciplineID: string ){
        return this.monthLoadedTabel.filter( obj => obj.disciplineID == disciplineID );
    }

    addLoadedMonth( obj: { disciplineID: string, year: number, month: number } ){
        this.monthLoadedTabel.push( obj );
    }

    loadExamensFromService(disciplineId: string, year: number, month: number) {
        this.service.getExamensForDiscipline(disciplineId, year, month)
            .then(data => {
               for (var i = 0; i < data.length; i++) {
                   let ex = new ExamenModel();
                   ex.id = data[i].id;
                   ex.disciplineId = data[i].disciplineId;
                   ex.startTime = data[i].startTime;
                   ex.endTime = data[i].endTime;
                   ex.isShared = data[i].isShared;
                   ex.limit = data[i].limit;
                   ex.students = data[i].students;
                   this.examens.push( ex  );
               }
                this.addLoadedMonth( { disciplineID: disciplineId, year: year, month: month } );
            });
    }

    getExamensByDiscipline(disciplineId: string) {
        return this.examens.filter(item => item.disciplineId == disciplineId);
    }    

}
