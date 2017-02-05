import { DataManagerService } from './../../Services/data-manager.service';
import { DisciplineModel } from './../../Models/discipline-model';
import { Component, OnInit } from '@angular/core';

@Component({  
  selector: 'app-discipline-list',
  templateUrl: './discipline-list.component.html',
  styleUrls: ['./discipline-list.component.css']
})
export class DisciplineListComponent implements OnInit {

  disciplines: DisciplineModel[] = [];

  isActive: boolean = true;
	forTeacher: string = 'all';

  constructor(private dataManager: DataManagerService) {}

  ngOnInit() {
		this.disciplines = this.dataManager.getDisciplinesAll();
	}

	getDisciplines(){
		let array = this.disciplines;

		if ( this.isActive ){
			array = array.filter( item => item.active );
		}
		if ( this.forTeacher != 'all'){
			array = array.filter( item => item.teacherId == this.forTeacher );
		}
		
		return array;
	}

	filterActiveChange( checked: boolean ){
		this.isActive = checked;
	}

	filterTeacherChange( teacherId: string ){
		console.log(teacherId);
		this.forTeacher = teacherId;
	}

	getTeachers(){
		return this.dataManager.getTeachersAll();
	}

	getTeacher( id: string ){
		return this.dataManager.getTeacherById(id);
	}

	getCurrentTeachers(){
		return	this.disciplines.map( item => this.getTeacher(item.teacherId) )
					.filter( (value, index, self) => self.indexOf(value) === index );
	}	
}
