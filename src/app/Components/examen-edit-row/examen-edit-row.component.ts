import { CommentModel } from './../../Models/comments-model';
import { element } from 'protractor';
import { DisciplineModel } from './../../Models/discipline-model';
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
	@Input() rates: RateModel[];
	@Input() comments: CommentModel[];
	@Input() examens: ExamenModel[];

	@Output() onAdd = new EventEmitter();
	@Output() onUpdate = new EventEmitter();
	@Output() onDelete = new EventEmitter();

	constructor(private dataManager: DataManagerService,
		private dataManagerStudents: DataManagerStudentService,
		private datamanagerRates: DataManagerRatesService) { }

	ngOnInit() {}

	changeRateValue(value) {
		if (!this.rate && value > 0) {
			this.onAdd.emit(value);
		}

		if (this.rate && value > 0) {
			this.onUpdate.emit(value);
		}

		if (this.rate && value === 0) {
			this.onDelete.emit();
		}
	}

	curentRate() {
		const index = this.rates.map(rt => rt.examenID ? rt.examenID : undefined).indexOf(this.model.parentExamen.id);
		return this.rates[index];
	}

	historyRates() {
		return this.rates;
	}


	excludeStudent() {
		// this.dataManagerStudents.excludeStudent(this.model.examen, this.model.student).then(result => {
		// 	if (result) { this.model.studentID = undefined; this.model.student = undefined; }
		// });
	}

	ddd() {
		console.log(this.examens);
	}

}
