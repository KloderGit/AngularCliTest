import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TimeRange } from '../../../../Models/time-range.model';

@Component({
	selector: 'add-range',
	templateUrl: 'add-range.component.html',
	styleUrls: [ 'add-range.component.css' ]
})

export class AddRangeComponent implements OnInit {

	value: TimeRange[];

	@Input() date: Date;
	@Output() onChange = new EventEmitter();

	ngOnInit() {
		this.value = [];
	}

	addRange(x, y) {
		const range = new TimeRange( this.date );
		range.changeTime(x, y);
		this.value.push(range);

		this.value.sort(sortByDate);

		this.onChange.emit(this.value);

		function sortByDate( a , b ) { return (+a.startTime) - (+b.startTime); }
	}

	deleteRange( x ) {
		const ind = this.value.indexOf(x);
		this.value.splice(ind, 1);

		this.onChange.emit(this.value);
	}

}

