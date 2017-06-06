import { TimeRange } from './time-range.model';
import { diffTime } from './../Shared/function'

export interface IFormState{
	type: string;
	startTime: Date;
	endTime: Date;

	rangeList: TimeRange[];

	examensObject: FormExamenViewModel | FormExamenViewModel[];

	getCountPlace(): number;

	getFormResult();
	
	changeRanges(ranges: TimeRange[]);
}

export class FormCollective implements IFormState{

	type: string = 'collective';
	startTime: Date;
	endTime: Date;

	rangeList: TimeRange[];

	examensObject: FormExamenViewModel[];

	constructor( start: Date, end: Date){
		this.startTime = start;
		this.endTime = end;
		this.examensObject = new Array();
	}

	getCountPlace(): number {
		return this.getFormResult().length;
	}

	getFormResult() {
		return this.examensObject.filter(item => item.isSelected);
	}

	changeRanges(ranges: TimeRange[]) {
		this.rangeList = ranges;
	}

}

export class FormPersonal implements IFormState{
	type: string = 'personal';
	startTime: Date;
	endTime: Date;

	range: number;
	surplus: boolean = false;

	rangeList: TimeRange[];

	examensObject: FormExamenViewModel[];

	constructor( start: Date, end: Date){
		this.startTime = start;
		this.endTime = end;
		this.examensObject = new Array();
	}

	getCountPlace(): number{
		return this.getFormResult().length;
	}

	getFormResult(){
		return this.examensObject.filter( item => item.isSelected );
	}

	changeRanges(ranges: TimeRange[]) {
		this.rangeList = ranges;
	}	

}

export class FormExamenViewModel{
	start: Date;
	end: Date;
	isSelected: boolean;
	count: number;

	constructor( start: Date, end: Date, count?: number ){
		this.start = start;
		this.end = end;
		this.isSelected = true;
		this.count = count;
	}
}