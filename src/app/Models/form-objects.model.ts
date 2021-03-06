import { TimeRange } from './time-range.model';
import { diffTime } from './../Shared/function'

export interface IFormState{
	type: string;
	startTime: Date;
	endTime: Date;

	forGroup: string;

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

	forGroup: string = "";

	rangeList: TimeRange[];

	examensObject: FormExamenViewModel[];

	constructor( start: Date, end: Date){
		this.startTime = start;
		this.endTime = end;
		this.examensObject = new Array();
	}

	getCountPlace(): number {
		let t = this.getFormResult().map(el => el.count);
		let res = 0;
		for (let i = 0; i < t.length; i++) { 
			res = res + t[i];
		}
		return res;
	}

	getFormResult() {
		this.examensObject.forEach( ex => ex.group = this.forGroup);	
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

	forGroup: string = "";

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
		this.examensObject.forEach( ex => ex.group = this.forGroup);
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
	group: string;

	constructor( start: Date, end: Date, count?: number ){
		this.start = start;
		this.end = end;
		this.isSelected = true;
		this.count = count;
	}
}