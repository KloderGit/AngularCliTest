import { DataManagerRatesService } from './../../../Services/data-manager-rates.service';
import { RateModel } from './../../../Models/rate-model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'rate-selector',
	templateUrl: 'rate-selector.component.html',
	styleUrls: [ 'rate-selector.component.css' ]
})

export class RateSelectorComponent implements OnInit {

	@Input() rate: RateModel;
	@Output() onChange = new EventEmitter();

	ngOnInit() { }

	selectedRate( grade ){
		if (this.rate) { 
			return grade === this.rate.value ? true : false;
		}
		if (!this.rate && grade == 0) { 
			return true;
		}
		return false;
	}

	changeRate( grade ) { 
		this.onChange.emit( grade );
	}
}