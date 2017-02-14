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

@Injectable()
export class DataManagerService {

  disciplines: DisciplineModel[] = new Array();
  teachers: TeacherModel[] = new Array();
  examens: ExamenModel[] = new Array();

  monthLoadedTabel: {
    disciplineID: string,
    year: number,
    month: number
  }[] = [];

  constructor(private service: ServiceJsonService,
    private messages: MessagesService) {
    console.log('Создание DataManager');
    this.loadTeachers();
    this.loadDisciplines();
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
          dscp.active = data[i].active == 'Y' ? true : false;
          dscp.format = data[i].format;
          this.disciplines.push(dscp);
        }
        console.log('DataManager: Получены дисциплины из сервиса', this.disciplines);
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
          this.teachers.push(thr);
          }
        console.log('DataManager: Получены преподаатели из сервиса', data)
      });
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
    this.service.getExamensForDiscipline(disciplineId, year, month)
      .then(data => {
        for (var i = 0; i < data.length; i++) {

          let ex = ExamenModel.map(data[i]);
          //    ex.id = data[i].id;
          //    ex.disciplineId = data[i].disciplineId;
          //    ex.setStartTime = data[i].startTime;
          //    ex.setEndTime = data[i].endTime;
          //    ex.isShared = data[i].isShared;
          //    ex.limit = data[i].limit || 1;
          //    ex.students = data[i].students;
          this.examens.push(ex);
        }

        this.messages.addMessage(new Message({
          title: 'DataManager',
          content: 'Загружены данные: год - ' + year + ', месяц - ' + (month + 1),
          type: 'success'
        }));
        this.addLoadedMonth({
          disciplineID: disciplineId,
          year: year,
          month: month
        });
      });
  }

  getExamensByDiscipline(disciplineId: string) {
    return this.examens.filter(item => item.disciplineId == disciplineId);
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

    for (let i = 0; i < objects.length; i++) {
      let ex = new ExamenModel();
      ex.id = "new";
      ex.disciplineId = discplineID;
      ex.startTime = objects[i].start;
      ex.endTime = objects[i].end;
      ex.isShared = type == 'collective' ? true : false;
      ex.limit = objects[i].count;
      ex.students = [];

      this.examens.push(ex);
    }

    this.messages.addMessage(new Message({
      title: 'DataManager',
      content: 'Созданы экзамены для ' + (type == 'collective' ? objects[0].count : objects.length) + ' студентов.',
      type: 'success'
    }));
  }


  copyExamens(array: ExamenModel[], date) {

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


    for (let i = 0; i < newExamens.length; i++) {
      this.examens.push(newExamens[i]);
    }

    this.messages.addMessage(new Message({
      title: 'DataManager',
      content: 'Скопированно ' + array.length + ' экзаменов.',
      type: 'success'
    }));
  }

  deleteExamens(array: ExamenModel[]) {
    let cnt = 0;
    for (let i = 0; i < array.length; i++) {
      let indx = this.examens.indexOf(array[i]);
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
  }

  changeExamensDate(array: ExamenModel[], date) {
    array.forEach(item => {
      item.startTime.setFullYear(date.getFullYear());
      item.endTime.setFullYear(date.getFullYear());
      item.startTime.setMonth(date.getMonth());
      item.endTime.setMonth(date.getMonth());
      item.startTime.setDate(date.getDate());
      item.endTime.setDate(date.getDate());
    });
  }
}
