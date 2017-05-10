import { StudentModel } from './../../Models/student-model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'student-info',
	templateUrl: 'student-info.component.html',
	styleUrls: [ 'student-info.component.css' ]
})

export class StudentInfoComponent implements OnInit {

	@Input() student: StudentModel;

	ngOnInit() { }
}
