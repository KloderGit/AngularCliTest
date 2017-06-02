import { FormExamenViewModel } from './../../../../../Models/form-objects.model';
import { TimeRange } from './../../../../../Models/time-range.model';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { diffTime } from '../../../../../Shared/function'

@Component({
	selector: 'divide-time-selector',
	templateUrl: 'divide-time-selector.component.html',
	styleUrls: ['divide-time-selector.component.css' ]
})

export class DivideTimeSelectorComponent implements OnInit {

	@Input() range: TimeRange;
	@Output() onChange = new EventEmitter();

	blockSize: number;
	surplus: boolean;

	result: FormExamenViewModel[];

	ngOnInit() { }

	divide() { 
		console.log(this.range);
	}


	changeParams(value: number): void;
	changeParams(value: boolean): void;
	changeParams(value: number | boolean): void {
		if (typeof value == 'number') {
			if (value && value < 5) { return; }
			this.blockSize = value || this.blockSize;
		}		
		if (typeof value == 'string') {
			this.blockSize = parseInt(value);
		}
		if (typeof value == 'boolean') {
			this.surplus = value;
		}
		this.divideRange();
	}

	private divideRange() {

		this.result = new Array();

		let count: number;
		let mod = diffTime(this.range.startTime, this.range.endTime, 'minutes') % this.blockSize;

		if (mod > 0 && this.surplus) {
			count = Math.floor(diffTime(this.range.startTime, this.range.endTime, 'minutes') / this.blockSize) + 1;
		} else {
			count = Math.floor(diffTime(this.range.startTime, this.range.endTime, 'minutes') / this.blockSize);
		}

		let index = 0;

		for (let i = 0; i < count; i++) {
			let tm = new Date(this.range.startTime);
			tm.setMinutes(index);
			let mt = new Date(this.range.startTime);
			mt.setMinutes(index + this.blockSize);

			this.result.push(new FormExamenViewModel(tm, mt, undefined));

			index += this.blockSize;
		}

		this.onChange.emit(this.result);
	}

}