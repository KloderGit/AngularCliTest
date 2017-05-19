import { DataManagerStudentService } from './../../Services/data-manager-students.service';
import { DataManagerRatesService } from './../../Services/data-manager-rates.service';
import { ExamenRowModel } from './../../Models/examen-list-model';
import { getDateString } from 'app/Shared/function';
import { FormEditItem } from './../../Models/form-examen-edit-model';
import { CommentModel } from './../../Models/comments-model';
import { RateModel } from './../../Models/rate-model';
import { StudentModel } from './../../Models/student-model';
import { ExamenModel } from './../../Models/examen-model';
import { DataManagerService } from './../../Services/data-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DisciplineModel } from './../../Models/discipline-model';
import { Component, OnInit } from '@angular/core';
import { addFirstZero, uniqueFlatArray } from './../../Shared/function';

declare var $: any;

@Component({
	selector: 'examen-edit',
	templateUrl: 'examen-edit.component.html'
})

export class ExamenEditComponent implements OnInit {
	dateToString = getDateString;
	unique = uniqueFlatArray;

	date: Date = new Date();
	discipline: DisciplineModel;
	examens: ExamenModel[] = [];

	examensViewModel: ExamenRowModel[] = [];
	studentsList: StudentModel[] = [];
	ratesList: RateModel[] = [];
	comments: CommentModel[] = [];
	examensForRates: ExamenModel[] = [];

	constructor(private route: ActivatedRoute,
		private router: Router,
		private dataManager: DataManagerService,
		private dataManagerStudents: DataManagerStudentService,
		private datamanagerRates: DataManagerRatesService) {
		console.log('Создан компонент редактирования экзамена');
	}

	ngOnInit() {
		const date = this.route.snapshot.params['date'];
		const disciplineId = this.route.snapshot.params['discipline'];

		if (disciplineId === undefined || date === undefined) {
			this.router.navigate(['/disciplines']);
		} else {
			this.date.setTime(date);
			this.date.setHours(0, 0, 0);

			this.discipline = this.dataManager.getDisciplineByID(disciplineId);
			this.examens = this.dataManager.getExamensByDate(this.discipline.id, this.date);

			this.formViewModelInit();
			this.loadData();
		}
	}

	formViewModelInit() {
		for (let i = 0; i < this.examens.length; i++) {
			const item = this.examens[i];

			let count = item.limit || 1;
			if ( item.students.length > (item.limit || 1) ) {
				count = item.students.length;
			}

			for (let j = 0; j < count; j++) {
				const rowItem = new ExamenRowModel();
				rowItem.parentExamen = item;
				rowItem.studentID = item.students[j];
				this.examensViewModel.push(rowItem);
			}
		}
	}


	loadData() {
		const studenstIDForRequest = this.examens.filter(item => item.students.length > 0)
			.map(item => item.students)
			.reduce(function (result, num) {
				return result.concat(num);
			}, []);

		this.dataManager.getStudents(studenstIDForRequest).then(data => {
			this.studentsList = [];
			for (let i = 0; i < data.length; i++) {
				if (data[i]) {
					this.studentsList.push(new StudentModel(data[i].id, data[i].name, data[i].phone, data[i].skype, data[i].email));
				}
			}
		}).then(() => {
			return this.datamanagerRates.getRates(studenstIDForRequest).then(rates => {
				this.ratesList = rates;
				return rates.map( rt => { if (rt.examenID) { return rt.examenID; } } );
			});
		}).then( () => {
			this.dataManager.loadExamensByStudents(studenstIDForRequest).then( examens => {
				this.examensForRates = examens;
			});
		}).then(() => {
			this.dataManagerStudents.getComments(studenstIDForRequest).then(comments => {
				this.comments = comments;
			});
		});
	}

	selectStudent(item) {
		const id = item.studentID;
		const index = this.studentsList.map(st => st.id ? st.id : undefined).indexOf( id + '' );
		return this.studentsList[index];
	}

	selectRate(item) {
		const ratesOfCurentStudent = this.ratesList.filter(rt => rt.studentID === item.studentID + '');
		const index = ratesOfCurentStudent.map(rt => rt.examenID ? rt.examenID : undefined).indexOf(item.parentExamen.id);
		return ratesOfCurentStudent[index];
	}

	selectRates(item) {
		return this.ratesList.filter(rt => rt.studentID === item.studentID + '');
	}

	selectComments(item) {
		const studentID = item.studentID;
		return this.comments.filter(cm => cm.studentID == item.studentID);
	}

	selectExamensForRate(item){
		const studentID = item.studentID;
		return this.examensForRates.filter(ex => ex.students.indexOf(studentID) < 0 ? false : true  );
	}

	addRate( examen: ExamenModel, student: StudentModel, rateValue ) {
		this.datamanagerRates.add(examen, student, rateValue).then(data => {
			this.ratesList.push(data);
			$('.event-rate').tooltip('hide');			
		});
	}

	updeteRate( rate: RateModel, value ) {
		this.datamanagerRates.edit( rate, value).then(data => {
			rate.value = data.value;
			$('.event-rate').tooltip('hide');
		});
	}

	deleteRate( rate: RateModel ) {
		this.datamanagerRates.delete(rate).then(data => {
			if (data) {
				const index = this.ratesList.map(i => i.id ? i.id : undefined).indexOf(rate.id);
				this.ratesList.splice(index, 1);
			}
			$('.event-rate').tooltip('hide');
		});	
	}
}
