import { element } from 'protractor';
import { FormExamenViewModel } from './../../../../Models/form-objects.model';
import { TimeRange } from './../../../../Models/time-range.model';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
	selector: 'divide-ranges',
	templateUrl: 'divide-ranges.component.html',
	styleUrls: [ 'divide-ranges.component.css' ]
})

export class DivideRangesComponent implements OnInit, OnChanges {

	@Input() ranges: TimeRange[] = [];
	@Input() changeTriger = 0;

	@Output() onChange = new EventEmitter();

	rangeModel: { range: TimeRange, examenBlankVM: FormExamenViewModel[] } [] = [];

	ngOnInit() {}

	ngOnChanges(changes) {

		if (!this.ranges) { return; }

		this.rangeModel = [];

		for (let index = 0; index < this.ranges.length; index++) {
			const element = this.ranges[index];

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

		const t = this.rangeModel.filter(rm => !rm.examenBlankVM);

		if (t.length <= 0) {

			const res = this.rangeModel.filter(rm => rm.examenBlankVM)
				.map(item => item.examenBlankVM.length > 0 ? item.examenBlankVM : [])
				.reduce(function (result, num) {
					return result.concat(num);
				}, []);

			this.onChange.emit(res);
		}
	}

	ddd() {
		console.log(this.ranges, this.rangeModel);
	}

}
