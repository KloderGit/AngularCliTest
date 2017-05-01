import { ExamenRowModel } from './../../Models/examen-list-model';
import { DataManagerStudentService } from './../../Services/data-manager-students.service';
import { ExamenModel } from './../../Models/examen-model';
import { DataManagerService } from './../../Services/data-manager.service';
import { RateModel } from './../../Models/rate-model';
import { FormEditItem } from './../../Models/form-examen-edit-model';
import { Component, OnInit, Input } from '@angular/core';
import { getHoursString, getDateString } from 'app/Shared/function';


@Component({
	selector: 'examen-edit-row',
	templateUrl: 'examen-edit-row.component.html',
	styleUrls: [ 'examen-edit-row.component.css' ]
})

export class ExamenEditRowComponent implements OnInit {

	@Input() model: ExamenRowModel;

	timeToString = getHoursString;

	constructor(private dataManager: DataManagerService,
		private dataManagerStudents: DataManagerStudentService) { }

	ngOnInit() {}

	// curentRate() {
	// 	const array = this.model.rates
	// 		.filter(item => item.examenID === this.model.examen.id);
	// 	const indx = array
	// 		.map(item => item.studentID)
	// 		.indexOf(this.model.studentID);
	// 	return array[indx];
	// }

	// historyRates() {
	// 	return this.model.rates.filter(rate => rate.examenID !== this.model.examen.id && rate.examenID);
	// }

	ddd() {
		console.log(this.model.examen.id, this.model.student.id);
		const t = this.dataManager.getExamenByID(this.model.examen.id);
		console.log(t);
		this.dataManager.getExamenByID(this.model.examen.id).students = [];
		console.log(t);
		this.model.studentID = undefined;
		this.model.student = undefined;
	}


	excludeStudent() {
		this.dataManagerStudents.excludeStudent(this.model.examen, this.model.student).then(result => {
			if (result) { this.model.studentID = undefined; this.model.student = undefined; }
		});
	}

}
