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
	@ViewChild("selfElement") selfElement: ElementRef;

	constructor(private dataManager: DataManagerService) { }
	
	ngOnInit() {}

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

popupWindow(){
	let childrenPopup = $(this.selfElement.nativeElement).find('.popoverAction');

	if( childrenPopup.is(':visible') ){
		childrenPopup.hide();
	} else {
		$('.popoverAction').hide();
		childrenPopup.show();
	}
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

