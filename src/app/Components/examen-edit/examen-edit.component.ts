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

	formModel: FormEditItem[];

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
			let count = this.examens[i].limit;

			for (let j = 0; j < count; j++) { 
				let editItem = new FormEditItem();
				editItem.startTime = this.examens[i].startTime;
				editItem.endTime = this.examens[i].endTime;
				this.formModel.push(editItem);
			}
		}
	}

	timeString(formItem: { start: Date, end: Date } ) { 
		return addFirstZero(formItem.start.getHours()) + ':' + addFirstZero(formItem.start.getMinutes())
			+ ' - ' + addFirstZero(formItem.end.getHours()) + ':' + addFirstZero(formItem.end.getMinutes());
	}	

}