import { Router, ActivatedRoute } from '@angular/router';
import { DataManagerService } from './../../Shared/data-manager.service';
import { Component, OnInit } from '@angular/core';
import { addFirstZero } from './../../Shared/function';
declare var $:any;

@Component({
	selector: 'examens-add',
	templateUrl: 'examens-add.component.html',
	styleUrls: [ 'examens-add.component.css' ]
})

export class ExamensAddComponent implements OnInit {

	date: Date = new Date();
	disciplineId: string;

	divided: { startTime: Date, endTime: Date, isSelected: boolean, disciplineId: string, countPlace: number }[] = [];

	divideBy: number = 10;
	divideByCheck: boolean = false;

	formState: { 
		type?: { 
			isSet: boolean,
			value: string
		},
		startTime?: Date,
		endTime?: Date,
		studentCount?: number,
		stydentArray: { startTime: Date, endTime: Date }[]
 	};

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

		this.formState =
		{
			type: { isSet: false, value: ''},
			startTime: new Date( this.date ),
			endTime: new Date( this.date ),
			stydentArray: new Array()
		}

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
		this.formState.type = { isSet: true, value: type };
		this.divided = [];
	}

	startTimeChange( value: any ){
		this.formState.startTime.setHours( value.hours, value.minutes );
		this.divided = [];
	}
	
	endTimeChange( value: any ){
		this.formState.endTime.setHours( value.hours, value.minutes );
		this.divided = [];
	}

	changeStudentCount( value: number ){
		this.formState.studentCount = value;
	}

	diffTime(){
		let diff = ( +this.formState.endTime - +this.formState.startTime );
		return diff;
	}

	formatTimeDigit(n){		
		return addFirstZero( n );
	}

	addExamen(){

		if ( this.formState.type.value == 'personal'){
			this.dataManager.addExamen( this.divided.filter( item => item.isSelected) );
		} 

		if ( this.formState.type.value == 'collective'){
			let result = [
				{ startTime: this.formState.startTime, endTime: this.formState.endTime, disciplineId: this.disciplineId, countPlace: this.formState.studentCount }
			];
			this.dataManager.addExamen( result );
		}

		this.router.navigate(['/discipline', this.disciplineId ]);
		
	}

	resultPersonalCount(){
		return this.divided.filter( item => item.isSelected );
	}

	changeDivideByButton( value: any ){
		value = parseInt(value);
		this.divideBy = value;
		this.dividePeriod();
	}
	changeDivideByInput( value: any ){
		value = parseInt(value);
		if( value < 5) { return }
		this.divideBy = value;
		this.dividePeriod();		
	}
	changeDivideByCheckBox( value: any ){
		this.divideByCheck = value;
		this.dividePeriod();		
	}

	dividePeriod(){
		let n = this.divideBy;
		let h = this.divideByCheck;
		this.divided = [];
		let count: number;
		let mod = (this.diffTime() / 1000 / 60) % n;

		if ( mod > 0 && h ){
			count = Math.floor( (this.diffTime() / 1000 / 60) / n ) + 1;
		} else {
			count = Math.floor( (this.diffTime() / 1000 / 60) / n );
		}

		let index = 0;
		let stT = this.formState.startTime;

		for(let i=0; i < count; i++){
			let tm = new Date(stT);			
			tm.setMinutes(index);
			let mt = new Date(stT);
			mt.setMinutes(index+n);
			this.divided[i] = { startTime: tm, endTime: mt, isSelected: true, disciplineId: this.disciplineId, countPlace: 1 };
			index +=n;
		}
	}

	getDiscipline(){
		return this.dataManager.getDisciplineByID( this.disciplineId );
	}

	getMonthName(){
		let str = this.formState.startTime.toLocaleString("ru-ru", { month: "long" }) + " " + this.formState.startTime.getFullYear();
        return str.charAt(0).toUpperCase() + str.slice(1);
    } 	
}