import { TimeRange } from './../../../../../Models/time-range.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'divide-count-selector',
	templateUrl: 'divide-count-selector.component.html',
	styleUrls: [ 'divide-count-selector.component.css' ]
})

export class DivideCountSelectorComponent implements OnInit {

	@Output() onChange = new EventEmitter();

	currentValue;
	
	ngOnInit() { }

	changeValue( value ) { 
		this.currentValue = value;
	}

	addStudents() { 
		this.onChange.emit(this.currentValue);
	}	
}