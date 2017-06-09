import { DataManagerService } from './../../Services/data-manager.service';
import { DisciplineModel } from './../../Models/discipline-model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import '../../../../node_modules/peity/jquery.peity.min.js';


declare var $: any;

@Component({
	selector: 'discipline',
	templateUrl: 'discipline.component.html',
	styleUrls: [ 'discipline.component.css' ]
})

export class DisciplineComponent implements OnInit {

	discipline: DisciplineModel;

	constructor( private route: ActivatedRoute,
				 private router: Router,
				 // tslint:disable-next-line:one-line
				 private dataManager: DataManagerService){
		console.log('Создан компонент Дисциплины');
	}

	ngOnInit() {
		const id = this.route.snapshot.params['id'];
		this.discipline = this.dataManager.getDisciplineByID(id);

		if ( this.discipline === undefined ) {
			this.router.navigate(['/disciplines']);
		} else {
			const currentDate = new Date();
			const curentIsLoaded = this.getMonthLoaded()
										.filter( yar => yar.year === currentDate.getFullYear())
										.filter( mth => mth.month === currentDate.getMonth());
			if ( curentIsLoaded.length === 0 ) {
				this.loadMonth( currentDate.getFullYear(), currentDate.getMonth() );
			}
		}
	}

	getMonthLoaded() {
		return this.dataManager.getLoadedMonth( this.discipline.id );
	}

	loadMonth( year: number, month: number ) {
		this.dataManager.loadExamensFromService( this.discipline.id, year, month );
	}

	loadAnyMonth(inputElement) {
		const altInputId = $(inputElement).siblings('input').attr('id');
		const anyMonth = $('#' + altInputId).val();

		if ( anyMonth === '' || anyMonth === undefined) {
			return;
		}

		const array = anyMonth.split(':');
		const year = parseInt(array[0]);
		const month = parseInt(array[1]) - 1;

		const test = this.getMonthLoaded().filter( yr => yr.year === year )
										.filter( mn => mn.month === month );

		this.loadMonth( year, month );
	}

	getExamens() {
		return this.dataManager.getExamensByDiscipline( this.discipline.id );
	}

}
