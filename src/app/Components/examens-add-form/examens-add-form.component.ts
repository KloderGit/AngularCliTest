import { TimeRange } from './../../Models/time-range.model';
import { DataManagerService } from './../../Services/data-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormState, FormPersonal, FormCollective } from './../../Models/form-objects.model';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { addFirstZero, getMonthName, diffTime } from './../../Shared/function';


declare var $: any;

@Component({
	selector: 'examens-add-form',
	templateUrl: './examens-add-form.component.html',
	styleUrls: [ './examens-add-form.component.css' ]
})

export class ExamensAddFormComponent implements OnInit, AfterViewInit {

	date: Date = new Date();
	disciplineId: string;
	monthName = getMonthName;

	formObj: IFormState;

	changeTrigerForChart = 0;

	@ViewChild('saveButton') saveButton: ElementRef;

	constructor(private route: ActivatedRoute,
		private router: Router,
		private dataManager: DataManagerService,
		private cdr: ChangeDetectorRef) {
		console.log('Создан компонент создания экзаменов');
	}

	ngOnInit() {
		const date = this.route.snapshot.params['date'];
		this.disciplineId = this.route.snapshot.params['discipline'];

		if (this.disciplineId == undefined || this.date == undefined) {
			this.router.navigate(['/disciplines']);
		}

		this.date.setTime(date);
		this.date.setHours(0, 0, 0);
	}

	ngAfterViewInit() { 
		$(this.saveButton.nativeElement).tooltip(
			{
				title: 'Дождитесь окончания действия.',
				trigger: 'manual',
				placement: 'left'
			}
		);
	}

	changeExamenType(type: string) {
		if (type === 'personal') { this.formObj = new FormPersonal(new Date(this.date), new Date(this.date)); }
		if (type === 'collective') { this.formObj = new FormCollective(new Date(this.date), new Date(this.date)); }
		this.cdr.detectChanges();
		this.formObj.rangeList = [];
		this.changeTrigerForChart++;

		console.log('Смена типа экзамена');
	}

	changeRange(ranges: TimeRange[]) {
		this.formObj.changeRanges(ranges);
		this.changeTrigerForChart++;
	}

	changeDivideResult(value) {
		this.formObj.examensObject = [];
		for (let index = 0; index < value.length; index++) {
			const element = value[index];

			this.formObj.examensObject.push(element);
		}		
	}

	formatTimeDigit(n) {
		return addFirstZero(n);
	}


	getDiscipline() {
		return this.dataManager.getDisciplineByID(this.disciplineId);
	}

	saveExamens() {
		const ttt = this.formObj.getFormResult();

		console.log('Сохраняем экзамен');

		$(this.saveButton.nativeElement).tooltip('show');	

		this.dataManager.addExamens(this.formObj.getFormResult(), this.formObj.type, this.disciplineId)
			.then(i => {
				if (i) {
					console.log('Экзамен сохранен', i);
					this.router.navigate(['/discipline', this.disciplineId]);
				} else {
					console.log(i);
					return;
				}
				$(this.saveButton.nativeElement).tooltip('hide');
			}).catch(e => { 
				console.log(e);				
				$(this.saveButton.nativeElement).tooltip('hide');
			});
	}

	getDateString() {
		return this.date.getDate() + '-' + this.date.getMonth() + '-' + this.date.getFullYear();
	}

	getMinHoursInfoPanel() { 

		if (!this.formObj.rangeList) { return; }

		let t = Math.min.apply(null, this.formObj.rangeList.map(rl => rl.startTime));
		t = new Date(t);

		return t;
	}

	getMaxHoursInfoPanel() {

		if (!this.formObj.rangeList) { return; }

		let t = Math.max.apply(null, this.formObj.rangeList.map(rl => rl.endTime));
		t = new Date(t);
		return t;
	}

}
