import { CommentModel } from './../../Models/comments-model';
import { DisciplineModel } from './../../Models/discipline-model';
import { DataManagerRatesService } from './../../Services/data-manager-rates.service';
import { StudentModel } from './../../Models/student-model';
import { ExamenRowModel } from './../../Models/examen-list-model';
import { DataManagerStudentService } from './../../Services/data-manager-students.service';
import { ExamenModel } from './../../Models/examen-model';
import { DataManagerService } from './../../Services/data-manager.service';
import { RateModel } from './../../Models/rate-model';
import { FormEditItem } from './../../Models/form-examen-edit-model';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { getHoursString, getDateString, uniqueFlatArray } from 'app/Shared/function';

declare var $: any;

@Component({
	selector: 'examen-edit-row',
	templateUrl: 'examen-edit-row.component.html',
	styleUrls: [ 'examen-edit-row.component.css' ]
})

export class ExamenEditRowComponent implements OnInit {
	timeToString = getHoursString;
	dateToString = getDateString;
	unique = uniqueFlatArray;

	isACtive: boolean = false;

	@Input() model: ExamenRowModel;
	@Input() student: StudentModel;
	@Input() rate: RateModel;
	@Input() rates: RateModel[];
	@Input() comments: CommentModel[];
	@Input() examens: ExamenModel[];

	@Output() onAdd = new EventEmitter();
	@Output() onUpdate = new EventEmitter();
	@Output() onDelete = new EventEmitter();
	@Output() onCommentChange = new EventEmitter();

	@ViewChild("selfElement") selfElement: ElementRef;
	@ViewChild("rootElement") rootElement: ElementRef;

	constructor(private dataManager: DataManagerService,
		private dataManagerStudents: DataManagerStudentService,
		private datamanagerRates: DataManagerRatesService) { }

	ngOnInit() {
		$(this.selfElement.nativeElement).tooltip(
			{
				title: 'Дождитесь окончания действия.',
				trigger: 'manual',
				placement: 'left'
			}
		);
	}

	changeRateValue(value) {

		if (!this.rate && value > 0) {
			$(this.selfElement.nativeElement).tooltip('show');
			this.onAdd.emit(value);
		}

		if (this.rate && value > 0) {
			$(this.selfElement.nativeElement).tooltip('show');
			this.onUpdate.emit(value);
		}

		if (this.rate && value == 0) {
			$(this.selfElement.nativeElement).tooltip('show');			
			this.onDelete.emit();
		}
	}

	curentRate() {
		const index = this.rates.map(rt => rt.examenID ? rt.examenID : undefined).indexOf(this.model.parentExamen.id);
		return this.rates[index];
	}

	history() {
		const examensView: { currentDay: boolean, discipline: string, date: Date, grade: number, comment: any }[] = [];
		for (let i = 0; i < this.examens.length; i++) {
			const element = this.examens[i];

			const grdIndx = this.rates.map( rt => rt.examenID || undefined ).indexOf(element.id);
			const grade = grdIndx >= 0 ? this.rates[grdIndx] : undefined;
			const comIndx = this.comments.map( cm => cm.examenID || undefined ).indexOf(element.id);

			examensView.push( {
				currentDay: element.id === this.model.parentExamen.id ? true : false,
				discipline: this.dataManager.getDisciplineByID(element.disciplineId).title || undefined,
				date: element.startTime || undefined,
				grade: grade ? grade.value ? grade.value : undefined : undefined,
				comment: this.comments[comIndx]
			} );
		}
		return examensView;
	}

	examenViewDiscipline() {
		let map = this.history().map( di => di.discipline );
		map = this.unique( map );
		const ind = map.indexOf( this.getDisciplineName() );
		map.splice(ind, 1);
		return map;
	}

	historyOrder(discipline) {
		function sortByDate( a , b ) { return (+b.date) - (+a.date); }
		return this.history().filter( vw => vw.discipline === discipline).sort(sortByDate);
	}

	historyCurrentDiscipline() {
		return this.historyOrder( this.getDisciplineName() );
	}

	historyAnotherDiscipline( discip ){
		return discip == this.getDisciplineName() ? [] : this.historyOrder( discip );
	}

	selectCurrentComment() {
		const i = this.historyCurrentDiscipline().map(obj => obj.currentDay ? obj.currentDay : undefined).indexOf(true);
		return i >= 0 ? this.historyCurrentDiscipline()[i] : undefined;
	}

	selectCurrentCommentValue() { 
		return this.selectCurrentComment() ?
			this.selectCurrentComment().comment ? this.selectCurrentComment().comment.comment : ''
			: '';
	}

	getDisciplineName(){
		return this.dataManager.getDisciplineByID(this.model.parentExamen.disciplineId).title;
	}

	excludeStudent() {
		const el = this.rootElement.nativeElement;
		
		this.dataManagerStudents.excludeStudent(this.model.parentExamen, this.student).then(result => {
			if (result) { this.model.studentID = undefined; this.student = undefined; }
			$(el).removeClass('selectedBox');		
		});
	}

	gradeValue( grade ) { 
		if (grade == 6) { return 'Зачет' }
		if (grade == 7) { return 'Незачет' }
		return grade;
	}

	collapseExamensBlock(element) { 		
		$(element).toggle();
	}


	isConsult() {
		let res = false;
		if (this.selectCurrentComment()) {
			const historyObject = this.selectCurrentComment();
			res = historyObject.comment ? historyObject.comment.isConsult ? true : false
			: false;
		}
		return res;
	}

	isExcelent() {
		let res = false;
		if (this.selectCurrentComment()) {
			const historyObject = this.selectCurrentComment();
			res = historyObject.comment ? historyObject.comment.excelent ? true : false
				: false;
		}
		return res;
	}	

	changeCommentText(value) { 
		let param: { comment: string } = { comment: undefined };
		param.comment = value;
		this.changeComment(param);
	}

	changeCommentConsult(value) { 
		let param: { isConsult: string } = { isConsult: undefined };
		param.isConsult = value ? 'true' : 'false';
		this.changeComment(param);
	}

	changeCommentExcelent(value) { 
		let param: { exelent: string } = { exelent: undefined };
		param.exelent = value ? 'true' : 'false';
		this.changeComment(param);
	}

	changeComment(param) {
		if( this.selectCurrentComment() ) {
			this.selectCurrentComment().comment ? this.editComment(param) : this.addComment(param);
		}
	}

	editComment(param) { 
		const historyObject = this.selectCurrentComment();
		this.onCommentChange.emit({ ItemID: historyObject.comment.id, param: param })
	}


	addComment( value ) {
		console.log('Создаем комментарий');
	}

}
