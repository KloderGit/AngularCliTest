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
	examens: ExamenModel[];

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
				editItem.student = item.students[j];
				this.formModel.push(editItem);
			}
		}

		this.fillFormModel();

	}


	fillFormModel() { 
		// С учетом того, что все студенты разнесены по элементам для формы
		let studenstIDForRequest = this.formModel.filter(item => item.student).map(item => item.student);

		// Выбор id студентов из всех экзаменов
		// let studenstIDForRequest = this.examens.filter(item => item.students.length > 0)
		// 	.map(item => item.students)
		// 	.reduce(function (result, num) {
		// 		return result.concat(num);
		// 	}, []);
		
		this.dataManager.getStudents(studenstIDForRequest).then(data => {
			for (let i = 0; i < data.length; i++) {
				let formElement = this.formModel[studenstIDForRequest.indexOf(parseInt(data[i].id))];
				formElement.student = new StudentModel(parseInt(data[i].id), data[i].name, data[i].phone, data[i].skype, data[i].email);
			}
			return this.examens;
		}).then(examens => { 
			let examenIDForRequest = this.examens.map(item => item.id);
			let studentIDArray = this.formModel.filter(item => item.student)
				.map(item => item.student.id);
			
			this.dataManager.getRates(examenIDForRequest).then(rates => { 
				for (let i = 0; i < rates.length; i++) {
					let formElement = this.formModel[studentIDArray.indexOf(parseInt(rates[i].studentID))];
					formElement.rate = new RateModel(rates[i].id, rates[i].examenID, rates[i].studentID, rates[i].rate);
				}
			}

			);
			}			
		);
	}

	getDateString() {
		return this.date.getDate() + '-' + this.date.getMonth() + '-' + this.date.getFullYear();
	}

}