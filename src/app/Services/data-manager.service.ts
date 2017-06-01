import { CommentModel } from './../Models/comments-model';
import { examenAddDTO } from './../DTO/exaxmensAddDTO';
import { Response } from '@angular/http';
import {
  FormExamenViewModel
} from './../Models/form-objects.model';
import {
  MessagesService,
  Message
} from './../Services/messages.service';
import {
  ExamenModel
} from './../Models/examen-model';
import {
  TeacherModel
} from './../Models/teacher-model';
import {
  ServiceJsonService
} from './../Services/service-json.service';
import {
  DisciplineModel
} from './../Models/discipline-model';

import {
  Injectable
} from '@angular/core';



import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';




@Injectable()
export class DataManagerService {

  disciplines: DisciplineModel[] = [];
  teachers: TeacherModel[] = [];
  examens: ExamenModel[] = [];

  monthLoadedTabel: {
    disciplineID: string,
    year: number,
    month: number
  }[] = [];

  constructor(private service: ServiceJsonService, private http: Http,
    private messages: MessagesService) {
    console.log('Создание DataManager');

    this.init();

    // this.loadTeachers();
    // this.loadDisciplines();
  }

  init() { 
    this.service.getTeachersAll()
      .then(tchr => {
        for (var i = 0; i < tchr.length; i++) {
          let thr = new TeacherModel();
          thr.id = tchr[i].id;
          thr.name = tchr[i].name;
          this.teachers.push(thr);
        }
      })
      .then( tchrs => { 
        this.service.getDisciplinesAll()
          .then(data => {
            for (var i = 0; i < data.length; i++) {
              let dscp = new DisciplineModel();
              dscp.id = data[i].id;
              dscp.title = data[i].title;
              dscp.teacherId = data[i].teacherId;
              dscp.active = data[i].active == 'Y' ? true : false;
              dscp.format = data[i].format;
              this.disciplines.push(dscp);
            }
          })
      });
  }  

  //  Дисциплины
  getDisciplinesAll() {
    return this.disciplines;
  }

  getDisciplineByID(id: string) {
    let index = this.disciplines.map(x => x.id).indexOf(id);
    return this.disciplines[index];
  }

  getTeachersAll() {
    return this.teachers;
  }

  getTeacherById(id: string) {
    return this.teachers[this.teachers.map(item => item.id).indexOf(id)];
  }


  //  Реестр загруженных месяцев

  getLoadedMonth(disciplineID: string) {
    return this.monthLoadedTabel.filter(obj => obj.disciplineID == disciplineID);
  }

  addLoadedMonth(obj: {
      disciplineID: string,
      year: number,
      month: number
    }) {
    this.monthLoadedTabel.push(obj);
  }


  //  Экзамены 

  loadExamensFromService(disciplineId: string, year: number, month: number) {

    let test = this.getLoadedMonth(disciplineId).filter(yr => yr.year == year)
      .filter(mn => mn.month == month);
    
    if (test.length > 0) { 
      this.messages.addMessage(new Message({
        title: 'DataManager',
        content: 'Данные за: год - ' + year + ', месяц - ' + month + ' уже загруженны',
        type: 'success'
      }));
      
      return;
    }


    this.service.getExamensForDiscipline(disciplineId, year, month)
      .then(data => {
        if (data) {
          for (var i = 0; i < data.length; i++) {
            let ex = ExamenModel.map(data[i]);
            this.examens.push(ex);
          }
          this.messages.addMessage(new Message({
            title: 'DataManager',
            content: 'Загружены данные: год - ' + year + ', месяц - ' + month,
            type: 'success'
          }));

          this.addLoadedMonth({
            disciplineID: disciplineId,
            year: year,
            month: month
          });
        }  
      });
  }

  loadExamensByIDs( array ) {
    return this.service.getExamensByIDs( array )
      .then(data => {
        let result = [];
        if (data) {
          for (var i = 0; i < data.length; i++) {
            let ex = ExamenModel.map(data[i]);
            result.push(ex);
          }
        }
        return result;
      });
  }

  loadExamensByStudents(array) {
    return this.service.getExamensByStudents(array)
      .then(data => {
        let result = [];
        if (data) {
          for (var i = 0; i < data.length; i++) {
            let ex = ExamenModel.map(data[i]);
            result.push(ex);
          }
        }        
        return result;
      });
  }  

  getExamensByDiscipline(disciplineId: string) {
    return this.examens.filter(item => item.disciplineId == disciplineId);
  }

  getExamensByDate(disciplineId: string, date: Date) {
    return this.examens.filter(item => item.disciplineId == disciplineId)
      .filter(item => item.startTime.getFullYear() == date.getFullYear())
      .filter(item => item.startTime.getMonth() == date.getMonth())
      .filter(item => item.startTime.getDate() == date.getDate());    
  }  

  getExamenByID(id: string) { 
    let r = this.examens.map(item => item.id).indexOf(id);
    let m = this.examens[r];
    return m;
  }

  addExamen(inObject: any) {
    for (let i = 0; i < inObject.length; i++) {

      let ex = new ExamenModel();
      ex.id = "new";
      ex.disciplineId = inObject[i].disciplineId;
      ex.startTime = inObject[i].startTime;
      ex.endTime = inObject[i].endTime;
      ex.isShared = inObject[i].countPlace != 1 ? true : false;
      ex.limit = inObject[i].countPlace != 1 ? inObject[i].countPlace : 1;
      ex.students = [];

      this.examens.push(ex);
    }
  }

  addExamens(objects: FormExamenViewModel[], type: string, discplineID: string) {

    let prefExamens = [];
    
    for (let i = 0; i < objects.length; i++) {
      let ex = new ExamenModel();
      ex.disciplineId = discplineID;
      ex.startTime = objects[i].start;
      ex.endTime = objects[i].end;      
      ex.isShared = type == 'collective' ? true : false;
      ex.limit = objects[i].count;

      prefExamens.push(ex);
    }

    return this.service.addExamens( prefExamens )
      .then( data => {
        if (data) {
          for (var i = 0; i < data.length; i++) {
            let ex = ExamenModel.map(data[i]);
            this.examens.push(ex);
          }
          this.messages.addMessage(new Message({
            title: 'DataManager',
            content: 'Успешно добавлено - ' + data.length + ' экзамен/ов.',
            type: 'success'
          }));
        } 
        // else {
        //   throw new Error("Новых экзаменов не добавлено.");
        // }
        return true;
      }
    )
    .catch( err => {
        this.messages.addMessage(new Message({
          title: 'DataManager',
          content: err,
          type: 'danger'
        }));
        return false; 
    });
  }


  copyExamens(array: ExamenModel[], date: Date) {  

    let dateIsLoaded: boolean = this.getLoadedMonth(array[0].disciplineId).filter(item => item.year == date.getFullYear())
      .filter(item => item.month == date.getMonth()).length > 0;
    
    if (!dateIsLoaded) { 
      this.messages.addMessage(new Message({
        title: 'DataManager',
        content: 'Месяц для копирования не загружен. Перед копированием загрузите целевой месяц.',
        type: 'danger'
      }));
      return;
    }

    let newExamens: ExamenModel[] = [];

    for (let i = 0; i < array.length; i++) {
      let ex = ExamenModel.map(array[i]);
      ex.startTime.setFullYear(date.getFullYear());
      ex.startTime.setMonth(date.getMonth());
      ex.startTime.setDate(date.getDate());
      ex.endTime.setFullYear(date.getFullYear());
      ex.endTime.setMonth(date.getMonth());
      ex.endTime.setDate(date.getDate());
      ex.students = [];

      newExamens.push(ex);
    }

    return this.service.copyExamens(newExamens)
      .then( data => {
        if (data) {
          for (var i = 0; i < data.length; i++) {
            let ex = ExamenModel.map(data[i]);
            this.examens.push(ex);
          }
        }
        this.messages.addMessage(new Message({
          title: 'DataManager',
          content: 'Успешно добавлено - ' + data.length + ' экзаменов.',
          type: 'success'
        }));
        return true;
      }
    )
    .catch( err => {
        this.messages.addMessage(new Message({
          title: 'DataManager',
          content: err,
          type: 'danger'
        }));
        return false; 
    });

  }


  deleteExamens(array: ExamenModel[]) {
    return this.service.deleteExamens(array)
      .then( data => {
        // let data = res.json();
        let cnt = 0;
        for (let i = 0; i < data.length; i++) {
          let indx = this.examens.map( item => item.id).indexOf(data[i]);
          if (indx != -1) {
            this.examens.splice(indx, 1);
            cnt += 1;
          }
        }        
        this.messages.addMessage(new Message({
          title: 'DataManager',
          content: 'Удалено ' + cnt + ' экзаменов.',
          type: 'success'
        }));
        return true;      
      }
    )
    .catch( err => {
        this.messages.addMessage(new Message({
          title: 'DataManager',
          content: err,
          type: 'danger'
        }));
        return false; 
    });
  }

  changeExamensDate(array: ExamenModel[], date) {

    let newExamens: ExamenModel[] = [];

    for (let i = 0; i < array.length; i++) {
      let ex = ExamenModel.map(array[i]);
      ex.startTime.setFullYear(date.getFullYear());
      ex.startTime.setMonth(date.getMonth());
      ex.startTime.setDate(date.getDate());
      ex.endTime.setFullYear(date.getFullYear());
      ex.endTime.setMonth(date.getMonth());
      ex.endTime.setDate(date.getDate());

      newExamens.push(ex);
    }   

    return this.service.changeExamens(newExamens)
      .then( data => {
        for(let i = 0; i < data.length; i++ ){
          let indxObj = array.map( item => item.id ).indexOf( data[i] );
          let exObj = array[indxObj];
          exObj.startTime.setFullYear(date.getFullYear());
          exObj.endTime.setFullYear(date.getFullYear());
          exObj.startTime.setMonth(date.getMonth());
          exObj.endTime.setMonth(date.getMonth());
          exObj.startTime.setDate(date.getDate());
          exObj.endTime.setDate(date.getDate());
        }
       
        this.messages.addMessage(new Message({
          title: 'DataManager',
          content: 'Перенесено ' + data.length + ' экзамен\ов.',
          type: 'success'
        }));        
        return true;      
      }
    )
    .catch( err => {
        this.messages.addMessage(new Message({
          title: 'DataManager',
          content: err,
          type: 'danger'
        }));
        return false; 
    });
  }


  getStudents(array: any[]) {
    let result = [];

    for (let i = 0; i < array.length; i++) {
      result.push(parseInt(array[i]));
    }

    return this.service.getStudents(result)
      .then(data => {
        return data;
      });
  }  


  getRates(array: any[]) {
    return this.service.getRates(array.filter(i=>i))
      .then(data => {
        return data;
      });
  } 


  editComment( itemID, param ) { 
    return this.service.editComment(itemID, param)
      .then(data => {

        if (!data) { throw new SyntaxError("Объект не найден");  }

        let comment = new CommentModel();

        for (let i = 0; i < data.length; i++) {
          const item = data[i];
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
        }

        return comment;
      })
      .catch(
        err => {
          this.messages.addMessage(new Message({
            title: 'DataManager',
            content: err,
            type: 'danger'
          }));
        }
      );
  }

  addComment(obj) {
    return this.service.addComment(obj)
      .then(data => {

        if (!data) { throw new SyntaxError("Объект не найден"); }

        let comment = new CommentModel();

        for (let i = 0; i < data.length; i++) {
          const item = data[i];
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
        }

        return comment;
      })
      .catch(
      err => {
        this.messages.addMessage(new Message({
          title: 'DataManager',
          content: err,
          type: 'danger'
        }));
      }
      );
  }  


}
