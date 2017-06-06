import { TimeRange } from './../../Models/time-range.model';
import { DataManagerService } from './../../Services/data-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormState, FormPersonal, FormCollective } from './../../Models/form-objects.model';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { addFirstZero, getMonthName, diffTime } from './../../Shared/function';


declare var $: any;

@Component({
	selector: 'examens-add-form',
	templateUrl: './examens-add-form.component.html',
	styleUrls: [ './examens-add-form.component.css' ]
})

export class ExamensAddFormComponent implements OnInit {

	date: Date = new Date();
	disciplineId: string;
	monthName = getMonthName;

	formObj: IFormState;

	changeTrigerForChart = 0;

	constructor(private route: ActivatedRoute,
		private router: Router,
		private dataManager: DataManagerService,
		private cdr: ChangeDetectorRef) {
		console.log('Создан компонент создания экзаменов');
	}

	ngOnInit() {

		const date = this.route.snapshot.params['date'];
		this.disciplineId = this.route.snapshot.params['discipline'];

		this.date.setTime(date);
		this.date.setHours(0, 0, 0);

	}

	changeExamenType(type: string) {
		if (type === 'personal') { this.formObj = new FormPersonal(new Date(this.date), new Date(this.date)); }
		if (type === 'collective') { this.formObj = new FormCollective(new Date(this.date), new Date(this.date)); }
		this.cdr.detectChanges();
		console.log('Смена типа экзамена', this.formObj);
	}

	changeTime(start?, end?) {
		if (start) {
			const time = new Date(this.formObj.startTime);
			time.setHours(start.hours, start.minutes);
			this.formObj.changeTime(time, null);
		}
		if (end) {
			const time = new Date(this.formObj.endTime);
			time.setHours(end.hours, end.minutes);
			this.formObj.changeTime(null, time);
		}
	}

	changeRange(ranges: TimeRange[]) {
		this.formObj.changeRanges(ranges);
		this.changeTrigerForChart++;
	}

	changeDivideResult(value) {
		this.formObj.examensObject = [];
		for (let index = 0; index < value.length; index++) {
			const element = value[index];

			this.formObj.examensObject.push(element);
		}

		// this.formObj.examensObject = value;
		// console.log(this.formObj.examensObject);
	}

	changeDivideCollectiveResult(value) { 
		
		this.formObj.changeParams(value);

		console.log(value);
		
	}	


	formatTimeDigit(n) {
		return addFirstZero(n);
	}


	getDiscipline() {
		return this.dataManager.getDisciplineByID(this.disciplineId);
	}

	saveExamens() {
		const ttt = this.formObj.getFormResult();

		console.log('Сохраняем экзамен');

		this.dataManager.addExamens(this.formObj.getFormResult(), this.formObj.type, this.disciplineId)
			.then(i => {
				if (i) {
					console.log('Экзамен сохранен', i);
					this.router.navigate(['/discipline', this.disciplineId]);
				} else {
					console.log(i);
					return;
				}
			});
	}

	getDateString() {
		return this.date.getDate() + '-' + this.date.getMonth() + '-' + this.date.getFullYear();
	}

}
