import { TeacherModel } from './../Models/teacher-model';
import { DisciplineModel } from './../Models/discipline-model';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http'
import 'rxjs/Rx';

@Injectable()
export class ServiceJsonService {

    constructor(private http: Http) {
        
        // this.getPredmetsFromPhp();

    }

    // getPredmetsFromPhp() { 
    //     return this.http.get('./getPredmets.php')
    //         .toPromise()
    //         .then((res) => {
    //             console.log('Service: Сервис получил php');
    //             console.log(res);
    //             console.log(res.json(), 'JSONNNNNNN');
    //             // return res.json();
    //             }
    //         );        
    // }  

    getDisciplinesAll(){
        return this.http.get('http://dev.fitness-pro.ru/getPredmets.php')
        .toPromise()
        .then( ( res ) => { 
            console.log('Service: Сервис получил дисциплины'); 
               return res.json(); }
        );
    }

    getTeachersAll(){
        return this.http.get('http://dev.fitness-pro.ru/getTeachers.php')
        .toPromise()
        .then( ( res ) => { 
               let temp = res.json() as TeacherModel[]; 
               console.log('Service: Сервис получил преподавателей'); 
               return temp; }
        );
    }     

    getExamensForDiscipline( disciplineId: string, year: number, month: number ){
        return this.http.get('./assets/examens.mock.json')
        .toPromise()
        .then( ( res ) => {
               let array = res.json();
               console.log('Service: Сервис получил экзамены'); 
               return array.filter( item => item.disciplineId == disciplineId )
                          .filter( item => new Date(item.startTime).getFullYear() == year )
                          .filter( item => new Date(item.startTime).getMonth() == month );
            }
        );        
    }
}
