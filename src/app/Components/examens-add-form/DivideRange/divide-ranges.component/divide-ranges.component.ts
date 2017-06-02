import { element } from 'protractor';
import { FormExamenViewModel } from './../../../../Models/form-objects.model';
import { TimeRange } from './../../../../Models/time-range.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'divide-ranges',
	templateUrl: 'divide-ranges.component.html',
	styleUrls: [ 'divide-ranges.component.css' ]
})

export class DivideRangesComponent implements OnInit {

	@Input() ranges: TimeRange[] = [];
	@Input() changeTriger = 0;

	@Output() onChange = new EventEmitter();

	rangeModel: { range: TimeRange, examenBlankVM: FormExamenViewModel[] } [] = [];

	ngOnInit() {}

	ngOnChanges(changes) {

		if (!this.ranges) { return; } 

		this.rangeModel = []

		for (let index = 0; index < this.ranges.length; index++) {
			let element = this.ranges[index];

			this.rangeModel.push(
				{
					range: element,
					examenBlankVM: undefined
				}
			);
		}
	}

	divideOneRange(element, value) {
		element.examenBlankVM = value;

		let t = this.rangeModel.filter(rm => !rm.examenBlankVM);

		if (t.length <= 0) { 

			const y = this.rangeModel.filter(rm => rm.examenBlankVM)
				.map(item => item.examenBlankVM.length > 0)
				.reduce(function (result, num) {
					return result.concat(num);
				}, []);	
			
			console.log(y,'000000000000000000000000');
			
			
			this.onChange.emit(y);
		}
	}

	ddd() {
		console.log(this.ranges, this.rangeModel);
	}

}