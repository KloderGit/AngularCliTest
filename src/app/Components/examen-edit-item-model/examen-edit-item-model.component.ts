import { FormEditItem } from './../../Models/form-examen-edit-model';
import { Component, OnInit, Input } from '@angular/core';
import { addFirstZero } from './../../Shared/function';

@Component({
	selector: 'examen-edit-item-model',
	templateUrl: 'examen-edit-item-model.component.html',
	styleUrls: [ 'examen-edit-item-model.component.css' ]
})

export class ExamenEditItemModelComponent implements OnInit {

	@Input() model: FormEditItem;

	ngOnInit() {
		
	}


	timeString(formItem: FormEditItem) {
		return addFirstZero(this.model.startTime.getHours()) + ':' + addFirstZero(this.model.startTime.getMinutes())
			+ ' - ' + addFirstZero(this.model.endTime.getHours()) + ':' + addFirstZero(this.model.endTime.getMinutes());
	}	
}