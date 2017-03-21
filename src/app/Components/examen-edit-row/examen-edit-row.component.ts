import { ExamenModel } from './../../Models/examen-model';
import { DataManagerService } from './../../Services/data-manager.service';
import { RateModel } from './../../Models/rate-model';
import { FormEditItem } from './../../Models/form-examen-edit-model';
import { Component, OnInit, Input } from '@angular/core';
import { getHoursString, getDateString } from "app/Shared/function";


@Component({
	selector: 'examen-edit-row',
	templateUrl: 'examen-edit-row.component.html',
	styleUrls: [ 'examen-edit-row.component.css' ]
})

export class ExamenEditRowComponent implements OnInit {

	@Input() model: FormEditItem;

	timeToString = getHoursString;
	dateToString = getDateString;

	constructor( private dataManager: DataManagerService) { }	

	ngOnInit() {}

	curentRate() { 
		let array = this.model.rates
			.filter(item => item.examenID == this.model.examen.id);
		let indx = array
			.map(item => item.studentID)
			.indexOf(this.model.studentID);	
		return array[indx];
	}

	allRates() { 
		return this.model.rates.filter(rate => rate.examenID != this.model.examen.id && rate.examenID);
	}

	getDiscipline(id) { 
		return this.dataManager.getDisciplineByID(id);
	}

}