import { DataManagerService } from './../../Services/data-manager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { addFirstZero, getMonthName, diffTime } from './../../Shared/function';
declare var $:any;

@Component({
	selector: 'examens-add',
	templateUrl: 'examens-add.component.html',
	styleUrls: [ 'examens-add.component.css' ]
})

export class ExamensAddComponent implements OnInit {

	date: Date = new Date();
	disciplineId: string;
	monthName = getMonthName;

	formObj: IFormState;

	constructor( private route: ActivatedRoute,
			 private router: Router,
			 private dataManager: DataManagerService){
		console.log("Создан компонент создания экзаменов");
	}

	ngOnInit() {
		let date = this.route.snapshot.params['date'];
		this.disciplineId = this.route.snapshot.params['discipline'];

		this.date.setTime(date);
		this.date.setHours(0,0,0);

		this.init_jquery();
	}

	init_jquery(){
			$('.nav-tabs > li a[title]').tooltip();

			$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
				var $target = $(e.target);
				if ($target.parent().hasClass('disabled')) {
					return false;
				}
			});

			$(".next-step").click(function (e) {
				var $active = $('.wizard .nav-tabs li.active');
				$active.next().removeClass('disabled');
				$($active).next().find('a[data-toggle="tab"]').click();
			});
			$(".prev-step").click(function (e) {
				var $active = $('.wizard .nav-tabs li.active');
				$($active).prev().find('a[data-toggle="tab"]').click();
			});
	};

	changeExamenType( type: string ){
		if ( type == 'personal') { this.formObj = new FormPersonal( new Date( this.date ), new Date( this.date ) ); }
		if ( type == 'collective') { this.formObj = new FormCollective( new Date( this.date ), new Date( this.date ) ); }
		console.log('Смена типа экзамена');
	}

	changeTime( start?, end? ){
		if (start){
			let time = new Date( this.formObj.startTime );
			time.setHours( start.hours, start.minutes );
			this.formObj.changeTime(time, null);
		}
		if (end){
			let time = new Date( this.formObj.endTime );
			time.setHours( end.hours, end.minutes );
			this.formObj.changeTime(null, time);
		}		
	}

	formatTimeDigit(n){		
		return addFirstZero( n );
	}


	getDiscipline(){
		return this.dataManager.getDisciplineByID( this.disciplineId );
	}

	saveExamens(){
		console.log( this.formObj.examensObject );
	}

}

interface IFormState{
	type: string;
	startTime: Date;
	endTime: Date;

	examensObject: FormExamenViewModel | FormExamenViewModel[];

	getCountPlace(): number;

	getFormResult();

	changeTime( start: Date, end: Date);

	changeParams( value: boolean | number);

	diffTime();
}

class FormCollective implements IFormState{

	type: string = 'collective';
	startTime: Date;
	endTime: Date;

	examensObject: FormExamenViewModel;

	constructor( start: Date, end: Date){
		this.startTime = start;
		this.endTime = end;
		this.examensObject = new FormExamenViewModel( this.startTime, this.endTime );
	}

	getCountPlace(): number{
		return this.examensObject.count;
	}

	changeParams( value: number ){
		this.examensObject.count = value;
	}

	changeTime( start?: Date, end?: Date){
		this.startTime = start || this.startTime;
		this.endTime = end || this.endTime;

		this.examensObject.start = this.startTime;
		this.examensObject.end = this.endTime;
	}

	getFormResult(){
		return new Array().push( this.examensObject );
	}

	diffTime(){
		return diffTime( this.startTime, this.endTime, 'minutes');
	}
}

class FormPersonal implements IFormState{

	type: string = 'personal';
	startTime: Date;
	endTime: Date;

	range: number;
	surplus: boolean = false;

	examensObject: FormExamenViewModel[];

	constructor( start: Date, end: Date){
		this.startTime = start;
		this.endTime = end;
		this.examensObject = new Array();
	}

	getCountPlace(): number{
		return this.getFormResult().length;
	}

	getFormResult(){
		return this.examensObject.filter( item => item.isSelected );
	}

	changeTime( start?: Date, end?: Date){
		this.startTime = start || this.startTime;
		this.endTime = end || this.endTime;

		this.range = undefined;
		this.surplus = false;

		this.examensObject = new Array();
	}


	changeParams( value: number ): void;
	changeParams( value: boolean ): void;
	changeParams( value: number | boolean ): void{
		if ( typeof value == 'string' ){
			value = parseInt(value);
		}
		if ( typeof value == 'number' ){
			if ( value && value < 5 ) { return; } 
			this.range = value || this.range;
		}
		if ( typeof value == 'boolean' ){
			this.surplus = value ;
		}
		this.divideRange();
	}

	private divideRange(){

		this.examensObject = new Array();

		let count: number;
		let mod = diffTime( this.startTime, this.endTime, 'minutes') % this.range;

		if ( mod > 0 && this.surplus ){
			count = Math.floor( diffTime( this.startTime, this.endTime, 'minutes') / this.range ) + 1;
		} else {
			count = Math.floor( diffTime( this.startTime, this.endTime, 'minutes') / this.range );
		}

		let index = 0;

		for(let i=0; i < count; i++){
			let tm = new Date( this.startTime );			
			tm.setMinutes(index);
			let mt = new Date( this.startTime );
			mt.setMinutes(index+this.range);

			this.examensObject.push( new FormExamenViewModel(tm, mt, 1) );

			index += this.range;
		}
	}

	diffTime(){
		return diffTime( this.startTime, this.endTime, 'minutes');
	}
}

class FormExamenViewModel{
	start: Date;
	end: Date;
	isSelected: boolean;
	count: number;

	constructor( start: Date, end: Date, count?: number ){
		this.start = start;
		this.end = end;
		this.isSelected = true;
		this.count = count;
	}
}