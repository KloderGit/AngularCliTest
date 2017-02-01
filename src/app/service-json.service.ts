import { DisciplineModel } from './discipline-model';
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

}
