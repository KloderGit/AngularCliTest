import { DataManagerService } from './../../Services/data-manager.service';
import { ExamenModel } from './../../Models/examen-model';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var $:any;

@Component({
	moduleId: module.id,
	selector: 'dayOfCalendar',
	templateUrl: 'dayOfCalendar.component.html',
	styleUrls: ['dayOfCalendar.component.css']
})

export class DayOfCalendarComponent implements OnInit{
	@Input() examens: ExamenModel[];
	@ViewChild("popupTarget") popupTarget: ElementRef;
	@ViewChild("popupWindow") popupWindow: ElementRef;
	
	elementDOMPositionX: number;
	elementDOMPositionY: number;

	constructor(private dataManager: DataManagerService) { }
	
	ngOnInit() { 
		let position = $(this.popupTarget.nativeElement).position();
		this.elementDOMPositionX = position.left;
		this.elementDOMPositionY = position.top;

		$(this.popupWindow.nativeElement).offset({ top: this.elementDOMPositionX, left: this.elementDOMPositionY});
	}


	ddd() { 
		$(this.popupWindow.nativeElement).toggle();
	}

	currentStudentsInvited(){

		// По количеству занятых экзаменов
		// let res1 = this.examens
		// 	.filter( examen => examen.students.length > 0)
		// 	.map( item => item.isShared ? item.limit : 1 )
		// 	.reduce(function (result, num) {
		// 		return result.concat(num);
		// 	}, []);

		// По записаному народу включая овер запись
		let res = this.examens
			.filter( examen => examen.students.length > 0)
			.map( item => item.students )
			.reduce(function (result, num) {
				return result.concat(num);
			}, []);

		return	res;
	}

	countExamensOfDay() {
		return this.examens
			.map(item => item.isShared ? item.limit: 1)
			.reduce(function (result, num) {
				return result + num;
			}, 0);
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

