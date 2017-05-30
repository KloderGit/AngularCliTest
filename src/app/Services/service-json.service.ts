import { RateModel } from './../Models/rate-model';
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

    rootURL = '/lichnyy-kabinet/examinations/assets/php/';

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
        return this.http.get(this.rootURL + 'getPredmets.php')
        .toPromise()
        .then( ( res ) => { 
            console.log('Service: Сервис получил дисциплины'); 
               return res.json(); }
        );
    }

    getTeachersAll(){
        return this.http.get(this.rootURL + 'getTeachers.php')
        .toPromise()
        .then( ( res ) => { 
               let temp = res.json() as TeacherModel[]; 
               console.log('Service: Сервис получил преподавателей'); 
               return temp; }
        );
    }     

    getExamensForDiscipline( disciplineId: string, year: number, month: number ){
        return this.http.get(this.rootURL + 'getExamens.php?disciplineId=' + disciplineId + '&year=' + year + '&month=' + month)
        .toPromise()
        .then( ( res ) => {
               let array = res.json();
               console.log('Service: Сервис получил экзамены'); 
               return array;
            }
        );
    }

    getExamensByIDs(array) { 
        let body = JSON.stringify(array);
        return this.http.get(this.rootURL + 'getExamensByIds.php?ids=' + body)
            .toPromise()
            .then((res) => {
                let array = res.json();
                console.log('Service: Сервис получил экзамены');
                return array;
            }
            );
    }

    getExamensByStudents(array) {
        let body = JSON.stringify(array);
        return this.http.get(this.rootURL + 'getExamensByStudent.php?ids=' + body)
            .toPromise()
            .then((res) => {
                    let array = res.json();
                    console.log('Service: Сервис получил экзамены');
                    return array;
                }
            );
    }       

    addExamens( array: ExamenModel[] ){
        let body = JSON.stringify(array);

        return this.http.post(this.rootURL + 'addExamens.php', body, { headers: this.headers })
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

        return this.http.post(this.rootURL + 'addExamens.php', body, { headers: this.headers })
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

        return this.http.post(this.rootURL + 'perenosExamens.php', body, { headers: this.headers })
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

        return this.http.post(  this.rootURL + 'deleteExamens.php', 
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

        return this.http.get(this.rootURL + 'getStudents.php?students=' + body)
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

        return this.http.get(this.rootURL + 'getRates.php?id=' + body)
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

    excludeStudent(examen: string, student: string) { 
        let body = JSON.stringify({ id: examen, student: student});

        return this.http.post(this.rootURL + 'leaveExamen.php',
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
            }); 
    }

    addRate( examen, student, rateValue ) { 
        let body = JSON.stringify({ action: 'add', params: { examenID: examen.id, studentID: student.id, value: rateValue } });

        return this.http.post(this.rootURL + 'rates.php',
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
            });  
    }

    editRate( rate: RateModel, value ) { 
        let body = JSON.stringify({ action: 'edit', params: { itemID: rate.id, value: value } });

        return this.http.post(this.rootURL + 'rates.php',
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
            });                 
    }

    deleteRate( rate ) { 
        let body = JSON.stringify({ action: 'delete', params: { itemID: rate.id } });
        return this.http.post(this.rootURL + 'rates.php',
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
            }); 
    }

    getStudentsComments(array: number[]) {
        let body = JSON.stringify(array);

        return this.http.get(this.rootURL + 'getComments.php?id=' + body)
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

    editComment( commentID, value ) {
        let body = JSON.stringify({ action: 'edit', params: { itemID: commentID, value: value } });

        return this.http.post(this.rootURL + 'comments.php',
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
            });
    }

    addComment(value) {
        let body = JSON.stringify({ action: 'add', params: { object: value } });
        console.log(body);

        return this.http.post(this.rootURL + 'comments.php',
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
            });
    }       

}


