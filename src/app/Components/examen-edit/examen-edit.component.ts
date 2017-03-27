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
import { addFirstZero } from './../../Shared/function';

@Component({
	selector: 'examen-edit',
	templateUrl: 'examen-edit.component.html'
})

export class ExamenEditComponent implements OnInit {

	date: Date = new Date();
	discipline: DisciplineModel;
	examens: ExamenModel[] = [];

	dateToString = getDateString;	

	students: StudentModel[] = [];

	formModel: FormEditItem[] = [];

	constructor(private route: ActivatedRoute,
		private router: Router,
		private dataManager: DataManagerService) {
		console.log("Создан компонент редактирования экзамена");
	}

	ngOnInit() {
		let date = this.route.snapshot.params['date'];
		let disciplineId = this.route.snapshot.params['discipline'];

		if (disciplineId == undefined || date == undefined) {
			this.router.navigate(['/disciplines']);
		} else { 
			this.date.setTime(date);
			this.date.setHours(0, 0, 0);

			this.discipline = this.dataManager.getDisciplineByID(disciplineId);
			this.examens = this.dataManager.getExamensByDate(this.discipline.id, this.date);

			this.formModelInit();
		
		}
	}

	formModelInit() { 
		for (let i = 0; i < this.examens.length; i++) {
			let item = this.examens[i];

			let count = item.limit || 1;
			if ( item.students.length > (item.limit || 1) ) { 
				count = item.students.length;
			}

			for (let j = 0; j < count; j++) {
				let editItem = new FormEditItem();
				editItem.startTime = item.startTime;
				editItem.endTime = item.endTime;
				editItem.examen = item;
				editItem.discipline = this.discipline;
				editItem.studentID = item.students[j];
				this.formModel.push(editItem);
			}
		}

		this.fillFormModel();

	}


	fillFormModel() { 
		// С учетом того, что все студенты разнесены по элементам для формы
		let studenstIDForRequest = this.formModel.filter(item => item.studentID).map(item => item.studentID);

		// Выбор id студентов из всех экзаменов
		// let studenstIDForRequest = this.examens.filter(item => item.students.length > 0)
		// 	.map(item => item.students)
		// 	.reduce(function (result, num) {
		// 		return result.concat(num);
		// 	}, []);
		
		this.dataManager.getStudents(studenstIDForRequest).then(data => {
			for (let i = 0; i < data.length; i++) {
				let formIndex = this.formModel.map(item => item.studentID).indexOf( parseInt(data[i].id) );
				let formElement = this.formModel[formIndex];
				formElement.student = new StudentModel(data[i].id, data[i].name, data[i].phone, data[i].skype, data[i].email);
			}
		}).then( () => { 	
			this.dataManager.getRates(studenstIDForRequest).then(rates => { 
					for (let i = 0; i < rates.length; i++) {
						let rate = new RateModel(rates[i].id, rates[i].examenID, rates[i].studentID, rates[i].rate);

						let formIndex = this.formModel.map(item => item.studentID).indexOf(rate.studentID);
						if (rate.examenID) { 
							this.formModel[formIndex].rates.push(rate);
						}
					}
					return rates.map(rate => rate.examenID);
			}).then(examens => {
				examens = examens.filter(item => item);
				console.log(examens);
					this.dataManager.loadExamensByIDs(examens).then(data => {
						let rates = this.formModel.filter(model => model.rates.length > 0)
							.map(model => model.rates)
							.reduce(function (result, num) {
								return result.concat(num);
							}, []);

						for (let i = 0; i < rates.length; i++) {
							rates[i].examen = data[data.map( ex => ex.id ).indexOf(rates[i].examenID)];
						}

					});

				});
			}
		);
	}


	changeRate() { 
		console.log();
	}


}