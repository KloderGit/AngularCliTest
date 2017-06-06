import { FormExamenViewModel } from './../../../../../Models/form-objects.model';
import { TimeRange } from './../../../../../Models/time-range.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
	selector: 'divide-count-selector',
	templateUrl: 'divide-count-selector.component.html',
	styleUrls: [ 'divide-count-selector.component.css' ]
})

export class DivideCountSelectorComponent implements OnInit {

	@Input() range: TimeRange;	
	@Output() onChange = new EventEmitter();

	currentValue;
	
	ngOnInit() { }

	changeValue( value ) { 
		this.currentValue = value;
	}

	addStudents() { 
		const res: FormExamenViewModel[] = [];

		const tm = new Date(this.range.startTime);
		const mt = new Date(this.range.endTime);

		res.push(new FormExamenViewModel(tm, mt, this.currentValue));
		this.onChange.emit(res);
	}
}