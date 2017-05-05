import { DataManagerRatesService } from './../../Services/data-manager-rates.service';
import { StudentModel } from './../../Models/student-model';
import { ExamenRowModel } from './../../Models/examen-list-model';
import { DataManagerStudentService } from './../../Services/data-manager-students.service';
import { ExamenModel } from './../../Models/examen-model';
import { DataManagerService } from './../../Services/data-manager.service';
import { RateModel } from './../../Models/rate-model';
import { FormEditItem } from './../../Models/form-examen-edit-model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { getHoursString, getDateString } from 'app/Shared/function';


@Component({
	selector: 'examen-edit-row',
	templateUrl: 'examen-edit-row.component.html',
	styleUrls: [ 'examen-edit-row.component.css' ]
})

export class ExamenEditRowComponent implements OnInit {
	timeToString = getHoursString;

	@Input() model: ExamenRowModel;
	@Input() student: StudentModel;
	@Input() rate: RateModel;

	@Output() onAdd = new EventEmitter();
	@Output() onUpdate = new EventEmitter();
	@Output() onDelete = new EventEmitter();

	constructor(private dataManager: DataManagerService,
		private dataManagerStudents: DataManagerStudentService,
		private datamanagerRates: DataManagerRatesService) { }

	ngOnInit() {}

	changeRateValue(value) { 

		console.log(this.rate, value);
		

		if (!this.rate && value > 0) {
			console.log('add');
			
			this.onAdd.emit(value);
		}	

		if (this.rate && value > 0) { 
			console.log('edit');
			
			this.onUpdate.emit(value);
		}		

		if (this.rate && value == 0) { 
			console.log('delete');
			
			this.onDelete.emit();
		}
	}


	excludeStudent() {
		// this.dataManagerStudents.excludeStudent(this.model.examen, this.model.student).then(result => {
		// 	if (result) { this.model.studentID = undefined; this.model.student = undefined; }
		// });
	}

}
