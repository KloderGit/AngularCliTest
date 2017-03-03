import { DataManagerService } from './../../Services/data-manager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { addFirstZero, getMonthName, diffTime } from './../../Shared/function';
import { IFormState, FormPersonal, FormCollective } from './../../Models/form-objects.model';
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
			 private dataManager: DataManagerService,
			 private cdr: ChangeDetectorRef){
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
		this.cdr.detectChanges();
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
		let ttt = this.formObj.getFormResult();

		console.log('Сохраняем экзамен');

		this.dataManager.addExamens( this.formObj.getFormResult(), this.formObj.type, this.disciplineId)
			.then(i => {
				if (i) {
					console.log('Экзамен сохранен', i);
					this.router.navigate(['/discipline', this.disciplineId]);
				} else { 
					console.log( i);
					return;
				}
			} )
	}
}