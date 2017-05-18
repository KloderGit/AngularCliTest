import { CommentModel } from './../../Models/comments-model';
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
import { getHoursString, getDateString, uniqueFlatArray } from 'app/Shared/function';


@Component({
	selector: 'examen-edit-row',
	templateUrl: 'examen-edit-row.component.html',
	styleUrls: [ 'examen-edit-row.component.css' ]
})

export class ExamenEditRowComponent implements OnInit {
	timeToString = getHoursString;
	dateToString = getDateString;
	unique = uniqueFlatArray;

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

	history() {
		const examensView: { currentDay: boolean, discipline: string, date: Date, grade: number, comment: any }[] = [];
		for (let i = 0; i < this.examens.length; i++) {
			const element = this.examens[i];

			const grdIndx = this.rates.map( rt => rt.examenID || undefined ).indexOf(element.id);
			const grade = grdIndx >= 0 ? this.rates[grdIndx] : undefined;
			const comIndx = this.comments.map( cm => cm.examenID || undefined ).indexOf(element.id);

			examensView.push( {
				currentDay: element.id === this.model.parentExamen.id ? true : false,
				discipline: this.dataManager.getDisciplineByID(element.disciplineId).title || undefined,
				date: element.startTime || undefined,
				grade: grade ? grade.value ? grade.value : undefined : undefined,
				comment: this.comments[comIndx]
			} );
		}
		return examensView;
	}

	examenViewDiscipline() {
		let map = this.history().map( di => di.discipline );
		map = this.unique( map );

const ind = map.indexOf( this.getDisciplineName() );
// map = map.splice(ind, 1);

console.log(map, ind);

		return map;
	}

	historyOrder(discipline) {
		function sortByDate( a , b ) { return (+b.date) - (+a.date); }

		return this.history().filter( vw => vw.discipline === discipline).sort(sortByDate);
	}

	historyCurrentDiscipline() {
		return this.historyOrder( this.getDisciplineName() );
	}

	historyAnotherDiscipline( discip ){
		return discip == this.getDisciplineName() ? [] : this.historyOrder( discip );
	}

	getDisciplineName(){
		return this.dataManager.getDisciplineByID(this.model.parentExamen.disciplineId).title;
	}

	excludeStudent() {
		// this.dataManagerStudents.excludeStudent(this.model.examen, this.model.student).then(result => {
		// 	if (result) { this.model.studentID = undefined; this.model.student = undefined; }
		// });
	}

	ddd() {
		console.log(this.history());
	}

}
