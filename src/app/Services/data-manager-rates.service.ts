import { RateModel } from './../Models/rate-model';
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
export class DataManagerRatesService {

    constructor(private service: ServiceJsonService,
        private http: Http,
        private messages: MessagesService) {
        console.log('Создание DataManager для Оценок');
    }



    // All rates of each students
    // array[] - array of students IDs
    getRates(array: any[]): Promise<RateModel[]> {
        return this.service.getRates(array.filter(i => i))
            .then(data => {
                const result = [];
                for (let i = 0; i < data.length; i++) {
                    const rate = new RateModel(data[i].id, data[i].examenID, data[i].studentID, data[i].rate);
                    result.push(rate);
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

    add( examen, student, rateValue ) {
        return this.service.addRate(examen, student, rateValue ).then(data => {
            if (!data) {
                return;
            }
            return new RateModel(data.id, data.examenID, data.studentID, data.rate);
        });
    }

    edit( rate: RateModel, value: string | number ) { 
        return this.service.editRate(rate, value).then(data => { 
            if (!data) { 
                return;
            }
            return new RateModel(data.id, data.examenID, data.studentID, data.rate);
        });
    }

    delete( rate: RateModel ) {
        return this.service.deleteRate(rate).then(data => {
            if (!data) {
                return;
            }
            return data;
        });
    }

}