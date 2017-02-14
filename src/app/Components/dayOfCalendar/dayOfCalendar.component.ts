import { DataManagerService } from './../../Services/data-manager.service';
import { ExamenModel } from './../../Models/examen-model';
import { Component, Input } from '@angular/core';

declare var $:any;

@Component({
	moduleId: module.id,
	selector: 'dayOfCalendar',
	templateUrl: 'dayOfCalendar.component.html',
	styleUrls: ['dayOfCalendar.component.css']
})

export class DayOfCalendarComponent{
	@Input() examens: ExamenModel[];

	constructor( private dataManager: DataManagerService) { }

	currentStudentsInvited(){
		debugger;
		let t = this.examens.map( item => item.students );
				// .filter( items => items	
				// 		.filter( item => item != null)
				// .length > 0)
				// .map(arr => arr.join());
		return	t;
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

	onAction( action ){
		switch (action) {
			case 'delete':
				this.deleteExamens(); 
				break;
			case 'copy':
				this.copyExamens(new Date);
				break;
			case 'change':
				this.changeExamens(new Date());
				break;
			case 'edit':
				this.editExamens();
				break;
		} 
	}

	deleteExamens() { 
		this.dataManager.deleteExamens(this.examens);
	}

	copyExamens( date: Date ) { 
		this.dataManager.copyExamens(this.examens, date);
	}

	changeExamens(date: Date ) { 
		this.dataManager.changeExamensDate(this.examens, date);
	}

	editExamens() { 
		console.log('Переход к редактированию');
	}
}

