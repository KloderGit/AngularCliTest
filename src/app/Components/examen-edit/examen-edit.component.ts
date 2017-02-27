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
		}
	}

	timeString(examen: ExamenModel) { 
		return addFirstZero(examen.startTime.getHours()) + ':' + addFirstZero(examen.startTime.getMinutes())
			+ ' - ' + addFirstZero(examen.endTime.getHours()) + ':' + addFirstZero(examen.endTime.getMinutes());
	}	

}