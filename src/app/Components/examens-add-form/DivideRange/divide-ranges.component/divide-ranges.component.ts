import { element } from 'protractor';
import { FormExamenViewModel } from './../../../../Models/form-objects.model';
import { TimeRange } from './../../../../Models/time-range.model';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { isArray } from "app/Shared/function";

@Component({
	selector: 'divide-ranges',
	templateUrl: 'divide-ranges.component.html',
	styleUrls: [ 'divide-ranges.component.css' ]
})

export class DivideRangesComponent implements OnInit, OnChanges {

	@Input() mainObject;
	@Input() ranges: TimeRange[] = [];
	@Input() changeTriger = 0;

	@Output() onChange = new EventEmitter();

	rangeModel: { range: TimeRange, result: any }[] = [];

	ngOnInit() {}

	ngOnChanges(changes) {

		if (!this.mainObject || !this.mainObject.rangeList) { return; }

		this.rangeModel = [];

		for (let index = 0; index < this.mainObject.rangeList.length; index++) {
			const element = this.ranges[index];

			this.rangeModel.push(
				{
					range: element,
					result: undefined
				}
			);
		}
	}

	divideOneRange(element, value) {
		element.result = value;

		const t = this.rangeModel.filter(rm => !rm.result);

		if (t.length <= 0) {

			const res = this.rangeModel.filter(rm => rm.result)
				.map(item => item.result.length > 0 ? item.result : [])
				.reduce(function (result, num) {
					return result.concat(num);
				}, []);

			this.onChange.emit(res);
		}
	}

	divideCollective(element, value) { 
		element.result = value;

		const t = this.rangeModel.filter(rm => !rm.result);

		if (t.length <= 0) {
			const res = this.rangeModel.filter(rm => rm.result)
				.map(item => item.result > 0 ? item.result : 0)
				.reduce(function (result, num) {
					return result + num;
				}, 0);
			
			this.onChange.emit(res);
		}
	}

	blockResultIsVisible( item ) { 
		return item ? 
				item.result ? true : false			
		 		: false;
	}

	studentsCount(item) { 
		const t = isArray(item);
		if (t) {
			return item.result.length;
		} else { 
			return item.result;
		}
	}

}
