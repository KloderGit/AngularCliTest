import { DataManagerService } from './../../Services/data-manager.service';
import { RateModel } from './../../Models/rate-model';
import { FormEditItem } from './../../Models/form-examen-edit-model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'examen-edit-row',
	templateUrl: 'examen-edit-row.component.html'
})

export class ExamenEditRowComponent implements OnInit {

	@Input() model: FormEditItem;

	constructor( private dataManager: DataManagerService) { }

	ngOnInit() { }

	curentRate() { 
		let array = this.model.rates
			.filter(item => item.examenID == this.model.examenID);
		let indx = array
			.map(item => item.studentID)
			.indexOf(this.model.studentID);		
		// this.model.rates
		// 	.filter(item => item.examenID == this.model.examenID)
		// 	.filter(item => item.studentID == this.model.studentID);
		return array[indx];
	}

	allRates() { 
		return this.model.rates.filter(item => item.examenID != this.model.examenID && item.examenID);
	}

}