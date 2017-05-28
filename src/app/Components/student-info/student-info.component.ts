import { StudentModel } from './../../Models/student-model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'student-info',
	templateUrl: 'student-info.component.html',
	styleUrls: [ 'student-info.component.css' ]
})

export class StudentInfoComponent implements OnInit {

	@Input() student: StudentModel;
	@Input() excelent: StudentModel;	
	@Output() onChangeExcelent = new EventEmitter();

	ngOnInit() { }

	studentPhoto() {
		return 'url(' + this.student.photo + ')';
	}

	changeExcelent(value) { 
		this.onChangeExcelent.emit(value);
	}
}
