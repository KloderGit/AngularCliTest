import {
  TeacherModel
} from './../../Models/teacher-model';
import {
  DataManagerService
} from './../../Services/data-manager.service';
import {
  DisciplineModel
} from './../../Models/discipline-model';
import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-discipline-list',
  templateUrl: './discipline-list.component.html',
  styleUrls: ['./discipline-list.component.css']
})
export class DisciplineListComponent implements OnInit {

  // filters
  isActive: boolean;
  forTeacher: string = 'all';

  constructor(private dataManager: DataManagerService) {}

  ngOnInit() {
    this.isActive = true;
    // this.disciplines = this.dataManager.getDisciplinesAll();
    // this.teachers = this.dataManager.getTeachersAll();
  }

  getDisciplines() {
	  let array = this.dataManager.getDisciplinesAll();

    if (this.isActive) {
      array = array.filter(item => item.active);
    }
    if (this.forTeacher != 'all') {
      array = array.filter(item => item.teacherId == this.forTeacher);
    }

    return array;
  }

  filterActiveChange(checked: boolean) {
    this.isActive = checked;
  }

  filterTeacherChange(teacherId: string) {
    this.forTeacher = teacherId;
  }

  getTeachers(): TeacherModel[] {
	  let res = this.dataManager.getTeachersAll();
	  return res;
  }

  getTeacher(id: string): TeacherModel {
	  let teachers = this.dataManager.getTeachersAll();
	  let res = teachers[teachers.map(item => item.id).indexOf(id)];
    return res;
  }

  getCurrentTeachers(): TeacherModel[] {
	  return this.dataManager.getDisciplinesAll().map(item => this.getTeacher(item.teacherId.toString()))
		  .filter((value, index, self) => self.indexOf(value) === index)
		  .filter( item => item );
  }
}
