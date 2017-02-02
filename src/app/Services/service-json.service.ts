import { TeacherModel } from './../Models/teacher-model';
import { DisciplineModel } from './../Models/discipline-model';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http'
import 'rxjs/Rx';

@Injectable()
export class ServiceJsonService {

  constructor(private http: Http) { }

    getDisciplinesAll(){
        return this.http.get('../assets/disciplines.mock.json')
        .toPromise()
        .then( ( res ) => { 
               console.log('Service: Сервис получил дисциплины'); 
               return res.json() as DisciplineModel[]; }
        );
    }

    getTeachersAll(){
        return this.http.get('../assets/teachers.mock.json')
        .toPromise()
        .then( ( res ) => { 
               let temp = res.json() as TeacherModel[]; 
               console.log('Service: Сервис получил преподавателей'); 
               return temp; }
        );
    }     

}
