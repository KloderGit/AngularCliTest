import { DataManagerService } from './../../Services/data-manager.service';
import { DisciplineModel } from './../../Models/discipline-model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import '../../../../node_modules/peity/jquery.peity.min.js';


declare var $:any;

@Component({
	selector: 'discipline',
	templateUrl: 'discipline.component.html'
})

export class DisciplineComponent implements OnInit {

	discipline: DisciplineModel;

	constructor( private route: ActivatedRoute,
				 private router: Router,
				 private dataManager: DataManagerService){
		console.log("Создан компонент Дисциплины");
	}

	ngOnInit() {
		let id = this.route.snapshot.params['id'];		
		this.discipline = this.dataManager.getDisciplineByID(id);

		if ( this.discipline == undefined ) {
			this.router.navigate(['/disciplines']); 
		} else {
			let currentDate = new Date();
			let curentIsLoaded = this.getMonthLoaded()
										.filter( yar => yar.year == currentDate.getFullYear())
										.filter( mth => mth.month == currentDate.getMonth());
			if ( curentIsLoaded.length == 0 ){
				this.loadMonth( currentDate.getFullYear(), currentDate.getMonth() )
			}			
		}
	}

	getMonthLoaded(){
		return this.dataManager.getLoadedMonth( this.discipline.id );
	}

	loadMonth( year: number, month: number ){
		this.dataManager.loadExamensFromService( this.discipline.id, year, month );
	}

	loadAnyMonth(inputElement) {
		let altInputId = $(inputElement).siblings('input').attr('id');
		let anyMonth = $('#' + altInputId).val();

		if ( anyMonth =="" || anyMonth == undefined){	
			return;
		}

		let array = anyMonth.split(':');
		let year = parseInt(array[0]);
		let month = parseInt(array[1]) - 1;

		let test = this.getMonthLoaded().filter( yr => yr.year == year )
										.filter( mn => mn.month == month );

		this.loadMonth( year, month );
	}	

	getExamens(){
		return this.dataManager.getExamensByDiscipline( this.discipline.id );
	}	

}