import { MessagesService, Message } from './../../Services/messages.service';
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

	constructor(private dataManager: DataManagerService, private messages: MessagesService) { }
	
	ngOnInit() {
		$(this.selfElement.nativeElement).tooltip(
			{
				title: 'Дождитесь окончания действия.',
				trigger: 'manual'
			}
		);
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

	deleteExamens() {
		$(this.selfElement.nativeElement).find('.popoverAction').hide();

		$(this.selfElement.nativeElement).tooltip('show');
		this.dataManager.deleteExamens(this.examens)
			.then( i => $(this.selfElement.nativeElement).tooltip('hide') )
			.catch( e => $(this.selfElement.nativeElement).tooltip('hide') );		
	}

	copyExamens( date: Date ) { 
		$(this.selfElement.nativeElement).find('.popoverAction').hide(); 

		let dateIsLoaded: boolean = this.dataManager.getLoadedMonth(this.examens[0].disciplineId).filter(item => item.year == date.getFullYear())
		.filter(item => item.month == date.getMonth()).length > 0;

		if (!dateIsLoaded) {
		this.messages.addMessage(new Message({
			title: 'Ошибка копирования',
			content: 'Месяц для копирования не загружен. Перед копированием загрузите целевой месяц.',
			type: 'danger'
		}));
		return;
		}

		$(this.selfElement.nativeElement).tooltip('show');
		this.dataManager.copyExamens(this.examens, date)
			.then( i => $(this.selfElement.nativeElement).tooltip('hide') )
			.catch( e => $(this.selfElement.nativeElement).tooltip('hide') );
	}

	changeExamens(date: Date ) { 

		$(this.selfElement.nativeElement).find('.popoverAction').hide(); 

		let dateIsLoaded: boolean = this.dataManager.getLoadedMonth(this.examens[0].disciplineId).filter(item => item.year == date.getFullYear())
		.filter(item => item.month == date.getMonth()).length > 0;

		if (!dateIsLoaded) {
		this.messages.addMessage(new Message({
			title: 'Ошибка переноса',
			content: 'Месяц для переноса не загружен. Перед переносом загрузите целевой месяц.',
			type: 'danger'
		}));
		return;
		}

		$(this.selfElement.nativeElement).tooltip('show');
		this.dataManager.changeExamensDate(this.examens, date)
			.then( i =>{
				console.log('sdsdsd');
				$(this.selfElement.nativeElement).tooltip('hide');
			} )
			.catch( e => {
				console.log('ddddddddddd');
				$(this.selfElement.nativeElement).tooltip('hide');
			} );
	}

	editExamens() { 
		console.log('Переход к редактированию');
	}
}

