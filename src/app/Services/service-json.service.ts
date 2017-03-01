import { ExamenModel } from './../Models/examen-model';
import { TeacherModel } from './../Models/teacher-model';
import { DisciplineModel } from './../Models/discipline-model';
import { MessagesService, Message } from './../Services/messages.service';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http'
import 'rxjs/Rx';

@Injectable()
export class ServiceJsonService {

    headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });

    constructor(private http: Http, private messages: MessagesService) {
        
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
        return this.http.get('http://dev.fitness-pro.ru/getExamens.php?disciplineId=' + disciplineId + '&year=' + year + '&month=' + month)
        .toPromise()
        .then( ( res ) => {
               let array = res.json();
               console.log('Service: Сервис получил экзамены'); 
               return array;
            }
        );        
    }

    addExamens( array: ExamenModel[] ){
        let body = JSON.stringify(array);

        return this.http.post('http://dev.fitness-pro.ru/addExamens.php', body, { headers: this.headers })
        .toPromise()
        .then( res => {
            let array = res.json();
            return array;
        },
            err => {
                this.messages.addMessage(new Message({
                    title: 'DataManager',
                    content: err,
                    type: 'danger'
                }));
            }
        );
    }



    copyExamens( array: ExamenModel[] ){
        let body = JSON.stringify(array);

        return this.http.post('http://dev.fitness-pro.ru/addExamens.php', body, { headers: this.headers })
        .toPromise()
        .then( res => {
            let array = res.json();
            return array;
        },
            err => {
                this.messages.addMessage(new Message({
                    title: 'DataManager',
                    content: err,
                    type: 'danger'
                }));
            }
        );
    }

    changeExamens( array: ExamenModel[] ){
        let body = JSON.stringify(array);

        return this.http.post('http://dev.fitness-pro.ru/perenosExamens.php', body, { headers: this.headers })
        .toPromise()
        .then( res => {
            let array = res.json();
            return array;
        },
            err => {
                this.messages.addMessage(new Message({
                    title: 'Service',
                    content: err,
                    type: 'danger'
                }));
            }
        );
    }

    deleteExamens( array: ExamenModel[] ){
        let body = JSON.stringify(array.map( item => item.id ));

        return this.http.post(  'http://dev.fitness-pro.ru/deleteExamens.php', 
                                body,
                                { headers: this.headers })
            .toPromise()
            .then(res => {
                return res.json();
            },
            err => {
                this.messages.addMessage(new Message({
                    title: 'Service',
                    content: err,
                    type: 'danger'
                }));
            }
            );        
    }


    getStudents(array: number[]) { 
        let body = JSON.stringify(array);

        return this.http.get('http://dev.fitness-pro.ru/getStudents.php?students=' + body)
            .toPromise()
            .then(res => {
                return res.json();
            },
            err => {
                this.messages.addMessage(new Message({
                    title: 'Service',
                    content: err,
                    type: 'danger'
                }));
            }
            );          
    }

    getRates(array: number[]) {
        let body = JSON.stringify(array);

        return this.http.get('http://dev.fitness-pro.ru/getRates.php?id=' + body)
            .toPromise()
            .then(res => {
                return res.json();
            },
            err => {
                this.messages.addMessage(new Message({
                    title: 'Service',
                    content: err,
                    type: 'danger'
                }));
            }
            );
    }    
}


