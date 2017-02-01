import { DataManagerService } from './../Shared/data-manager.service';
import { DisciplineModel } from './../discipline-model';
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

  str: string = 'ahdflaksdhdfalkshlakshflakjhfa';

  constructor(private dataManager: DataManagerService) {}

  ngOnInit() {  }

	getDisciplines(){
		let array = this.dataManager.getDisciplinesAll();

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

}
