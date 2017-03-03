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
	@Input() iterator: number;

	ngOnInit() {
		
	}


	timeString(formItem: FormEditItem) {
		return addFirstZero(this.model.startTime.getHours()) + ':' + addFirstZero(this.model.startTime.getMinutes())
			+ ' - ' + addFirstZero(this.model.endTime.getHours()) + ':' + addFirstZero(this.model.endTime.getMinutes());
	}

	rateValue() { 
		let res = '';

		if (this.model.rate && this.model.rate.value) { 
			res = this.model.rate.value;

			switch ( parseInt(res)) {
				case 6:
					res = 'Зачет';
					break;
				case 7:
					res = 'Незачет';
					break;
			}
		}

		return res;
	}
}