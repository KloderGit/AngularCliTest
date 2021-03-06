import { DataManagerStudentService } from './../../Services/data-manager-students.service';
import { DataManagerRatesService } from './../../Services/data-manager-rates.service';
import { ExamenRowModel } from './../../Models/examen-list-model';
import { getDateString, uniqueFlatArray } from 'app/Shared/function';
import { CommentModel } from './../../Models/comments-model';
import { RateModel } from './../../Models/rate-model';
import { StudentModel } from './../../Models/student-model';
import { ExamenModel } from './../../Models/examen-model';
import { DataManagerService } from './../../Services/data-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DisciplineModel } from './../../Models/discipline-model';
import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
	selector: 'examen-edit',
	templateUrl: 'examen-edit.component.html',
	styleUrls: ['examen-edit.component.css']
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

	changeTrigerForChart = 1;

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

		if (disciplineId == undefined || date == undefined) {
			this.router.navigate(['/disciplines']);
		} else {
			this.date.setTime(date);
			this.date.setHours(0, 0, 0);

			this.discipline = this.dataManager.getDisciplineByID(disciplineId);

			if (!this.discipline) {
				// this.router.navigateByUrl('../disciplines');
				// this.router.navigateByUrl('./disciplines', { relativeTo: this.route });
				window.location.href = '/disciplines';
			}

			this.examens = this.dataManager.getExamensByDate(this.discipline.id, this.date);
			this.formViewModelInit();
			this.loadData();
		}
	}

	ngOnChanges() {
		this.formViewModelInit();
	}

	exceptStudent(examen: ExamenModel) {
		console.log('Добавление экзамена вместо непришедшего пользователя экзамен');

		this.dataManager.addExamenForHistory(examen)
			.then(data => {
				if (data) {
					const rowItem = new ExamenRowModel();
					rowItem.parentExamen = examen;
					this.examensViewModel.push(rowItem);					
					this.examensViewModel.sort(function (a, b) {
						return +a.parentExamen.startTime > +b.parentExamen.startTime ? 1 : -1;
					});
				} else {
					console.log(data);
					return;
				}
			});
	}


	formViewModelInit() {
		for (let i = 0; i < this.examens.length; i++) {
			const item = this.examens[i];

			let count = item.limit || 1;
			if (item.students.length > (item.limit || 1)) {
				count = item.students.length;
			}

			for (let j = 0; j < count; j++) {
				const rowItem = new ExamenRowModel();
				rowItem.parentExamen = item;
				rowItem.studentID = item.students[j];
				this.examensViewModel.push(rowItem);
			}
		}

		this.examensViewModel.sort(function (a, b) {
			let result;
			if (+a.parentExamen.startTime == +b.parentExamen.startTime)
			{   
				let op1 = a == undefined || a.studentID == undefined ? 0 : a.studentID;
				let op2 = b == undefined || b.studentID == undefined ? 0 : b.studentID;
				result = op1 < op2 ? 1 : -1; }
			else
			{result = +a.parentExamen.startTime > +b.parentExamen.startTime ? 1 : -1;}

			return result;
		});
		// this.examensViewModel.sort(function (a, b) {
		// 	return a.studentID > b.studentID ? 1 : -1;
		// });
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
					this.studentsList.push(new StudentModel(data[i].id, data[i].name, data[i].phone, data[i].skype, data[i].email, data[i].photo));
				}
			}
		}).then(() => {
			return this.datamanagerRates.getRates(studenstIDForRequest).then(rates => {
				this.ratesList = rates;
				return rates.map(rt => { if (rt.examenID) { return rt.examenID; } });
			});
		}).then(() => {
			this.dataManager.loadExamensByStudents(studenstIDForRequest).then(examens => {
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
		const index = this.studentsList.map(st => st.id ? st.id : undefined).indexOf(id + '');
		return this.studentsList[index];
	}

	selectRate(item) {
		const ratesOfCurentStudent = this.ratesList.filter(rt => rt.studentID == (item.studentID + ''));
		const index = ratesOfCurentStudent.map(rt => rt.examenID ? rt.examenID : undefined).indexOf(item.parentExamen.id);
		return ratesOfCurentStudent[index];
	}

	selectRates(item) {
		return this.ratesList.filter(rt => rt.studentID === (item.studentID + ''));
	}

	selectComments(item) {
		const studentID = item.studentID;
		return this.comments.filter(cm => cm.studentID == item.studentID);
	}

	selectExamensForRate(item) {
		const studentID = item.studentID;
		return this.examensForRates.filter(ex => ex.students.indexOf(studentID) < 0 ? false : true);
	}

	addRate(examen: ExamenModel, student: StudentModel, rateValue) {
		this.datamanagerRates.add(examen, student, rateValue).then(data => {
			this.ratesList.push(data);
			$('.event-rate').tooltip('hide');
			this.changeTrigerForChart++;
		});
	}

	updeteRate(rate: RateModel, value) {
		this.datamanagerRates.edit(rate, value).then(data => {
			rate.value = data.value;
			$('.event-rate').tooltip('hide');
			this.changeTrigerForChart++;
		});
	}

	deleteRate(rate: RateModel) {
		this.datamanagerRates.delete(rate).then(data => {
			if (data) {
				const index = this.ratesList.map(i => i.id ? i.id : undefined).indexOf(rate.id);
				this.ratesList.splice(index, 1);
				this.changeTrigerForChart++;
			}
			$('.event-rate').tooltip('hide');
		});
	}

	divs() {
		return ['8:30', '9:00', '10:00', 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
	}

	updateComment(obj) {

		const ItemID = obj.ItemID;
		const param = obj.param;

		this.dataManager.editComment(ItemID, param)
			.then(data => {
				const indx = this.comments.map(cm => cm ? cm.id : undefined).indexOf(ItemID);
				if (data) {
					this.comments.splice(indx, 1, data);
				}
			});
	}

	addComment(objt) {
		this.dataManager.addComment(objt)
			.then(data => {
				if (data) {
					this.comments.push(data);
				}
			});
	}

}
