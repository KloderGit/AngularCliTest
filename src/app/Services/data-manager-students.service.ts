import { CommentModel } from './../Models/comments-model';
import { StudentModel } from './../Models/student-model';
import { ExamenModel } from './../Models/examen-model';
import { Response } from '@angular/http';
import { MessagesService, Message } from './../Services/messages.service';
import { ServiceJsonService } from './../Services/service-json.service';

import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class DataManagerStudentService { 

    constructor(private service: ServiceJsonService,
        private http: Http,
        private messages: MessagesService) {
        console.log('Создание DataManagerStudents');
    }

    getComments(array: any[]): Promise<CommentModel[]> {
        return this.service.getStudentsComments(array.filter(i => i))
            .then(data => {
                if (!data) { return []; }
                const result = [];
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    let comment = new CommentModel();

                    comment = {
                        id: item.id,
                        studentID: item.studentID + '',
                        examenID: item.examenID,
                        disciplineID: item.disciplineID,
                        date: item.date,
                        isExamen: item.isExamen,
                        isConsult: item.isConsult,
                        comment: item.comment,
                        excelent: item.excelent
                    };

                    result.push(comment);
                }

                return result;
            }).catch(err => {
                this.messages.addMessage(new Message({
                    title: 'DataManager',
                    content: err,
                    type: 'danger'
                }));
            });
    }


 excludeStudent(examen: ExamenModel, student: StudentModel) {
    return this.service.excludeStudent(examen.id, student.id)
        .then(data => {
            if (data == 'error') { return false; }

            let index = examen.students.indexOf(student.id);
            examen.students.slice(index, 1);

            this.messages.addMessage(new Message({
            title: 'DataManager',
            content: 'Студент отписан от экзамена.',
            type: 'success'
            }));
            return true;
      })
        .catch(err => {
            this.messages.addMessage(new Message({
                title: 'DataManager',
                content: err,
                type: 'danger'
            }));
            return false;
      });
  }


}