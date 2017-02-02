import { MonthGrid } from './../../Models/month.model';
import { Router } from '@angular/router';
import { ExamenModel } from './../../Models/examen-model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'calendar',
	templateUrl: 'calendar.component.html',
	styleUrls: [ 'calendar.component.css' ]
})

export class CalendarComponent implements OnInit {

	@Input() examens: ExamenModel[] = new Array();
	@Input() timestamp: Date;
	@Input() disciplineID: string;
	grid: MonthGrid;

	constructor( private router: Router ){
	}

	ngOnInit() {
		this.grid = new MonthGrid( new Date ( this.timestamp) );
	}

	getMonthName(){
		let dateForLocal = new Date( this.timestamp );
		let str = dateForLocal.toLocaleString("ru-ru", { month: "long" }) + " " + dateForLocal.getFullYear();
        return str.charAt(0).toUpperCase() + str.slice(1);
    } 

	editDay( date: Date ){
		this.router.navigate(['/addexamens', +date,  this.disciplineID ]);
	}

}