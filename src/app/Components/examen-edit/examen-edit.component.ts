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

	examensList: ExamenRowModel[] = [];

	constructor(private route: ActivatedRoute,
		private router: Router,
		private dataManager: DataManagerService) {
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

			this.formModelInit();
		}
	}

	formModelInit() {

		for (let i = 0; i < this.examens.length; i++) {
			const item = this.examens[i];

			let count = item.limit || 1;
			if ( item.students.length > (item.limit || 1) ) {
				count = item.students.length;
			}

			for (let j = 0; j < count; j++) {
				const rowItem = new ExamenRowModel();
				rowItem.examen = item;
				rowItem.studentID = item.students[j];
				this.examensList.push(rowItem);
			}
		}

		this.fillFormModel();
	}


	fillFormModel() {
		const studenstIDForRequest = this.examens.filter(item => item.students.length > 0)
			.map(item => item.students)
			.reduce(function (result, num) {
				return result.concat(num);
			}, []);

		this.dataManager.getStudents(studenstIDForRequest).then(data => {

			const studentsIDs = this.examensList.map(item => item.studentID);

			for (let i = 0; i < data.length; i++) {
				const index = studentsIDs.indexOf( parseInt(data[i].id) );

				if (index > -1) {
					this.examensList[index].student = new StudentModel(data[i].id, data[i].name, data[i].phone, data[i].skype, data[i].email);
				}
			}

		}).then( () => {
			this.dataManager.getRates(studenstIDForRequest).then(rates => {

				const examensIDs = this.examensList.map( item => item.examen.id);

				const ratesRes: RateModel[] = [];

					for (let i = 0; i < rates.length; i++) {
						const rate = new RateModel(rates[i].id, rates[i].examenID, rates[i].studentID, rates[i].rate);
						ratesRes.push(rate);
					}

					const ratesForThisDate = ratesRes.filter( item => {
						const t = examensIDs.indexOf( item.examenID );
						if (t > -1) {
							return true;
						}
					});

					for (let i = 0; i < ratesForThisDate.length; i++) {
						const elementRate = ratesForThisDate[i];

						const examensOfRate = this.examensList.filter( item => item.examen.id === elementRate.examenID );
						const arrayForSearchStudent = examensOfRate.map( item => item.student ? item.student.id : undefined);

						const index = arrayForSearchStudent.indexOf( elementRate.studentID );

						if (index > -1 && elementRate.examenID && elementRate.value) {
							examensOfRate[index].rate = elementRate;
						}

					}

						// const index = examensIDs.indexOf( rate.examenID );

						// const examensOfRate = this.examensList.filter( item => item.examen.id === rate.examenID );
						// const arrayForSearchStudent = examensOfRate.map( item => item.student ? item.student.id : undefined);
						// const index = arrayForSearchStudent.indexOf( rate.studentID );

						// if (index > -1 && rate.examenID && rate.value) {
						// 	this.examensList[index].rate = rate;
						// 	debugger;
						// }

				});
			}
		);
	}

}
