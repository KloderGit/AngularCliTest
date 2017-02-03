import { ExamenModel } from './../../Models/examen-model';
import { Component, OnInit, Input } from '@angular/core';

declare var $:any;

@Component({
	moduleId: module.id,
	selector: 'dayOfCalendar',
	templateUrl: 'dayOfCalendar.component.html',
	styleUrls: ['dayOfCalendar.component.css']
})

export class DayOfCalendarComponent implements OnInit {
	@Input() examens: ExamenModel[];

	ngOnInit() {}

	currentStudentsInvited(){
		return	this.examens.map( item => item.students )
				.filter( items => items	
						.filter( item => item != null)
				.length > 0)
				.map(arr => arr.join());
	}

	countExamensOfDay(){
		return	this.examens.map(item => item.limit)
				.reduce( (previus, current) => { 	
					if ( previus == null ){ previus = 1; }				
					if ( current == null ){ return previus +1;
					} else { return previus + current; }
				 });
	}

	percentageOneInTwo( x, y ){
		return Math.floor( 100 / ( y / x ));
	}
}

