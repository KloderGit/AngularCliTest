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

	changeTime(start: Date, end: Date);
	
	changeRanges(ranges: TimeRange[]);

	changeParams( value: boolean | number);

	diffTime();
}

export class FormCollective implements IFormState{

	type: string = 'collective';
	startTime: Date;
	endTime: Date;

	rangeList: TimeRange[];

	examensObject: FormExamenViewModel;

	constructor( start: Date, end: Date){
		this.startTime = start;
		this.endTime = end;
		this.examensObject = new FormExamenViewModel( this.startTime, this.endTime );
	}

	getCountPlace(): number{
		return this.examensObject.count;
	}

	changeParams( value: number ){
		this.examensObject.count = value;
	}

	changeTime( start?: Date, end?: Date){
		this.startTime = start || this.startTime;
		this.endTime = end || this.endTime;

		this.examensObject.start = this.startTime;
		this.examensObject.end = this.endTime;
	}
	
	changeRanges( ranges: TimeRange[] ) {
		this.rangeList = ranges;
	}

	getFormResult(){
		let res = new Array();
		res.push(this.examensObject);
		return res;
	}

	diffTime(){
		return diffTime( this.startTime, this.endTime, 'minutes');
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

	changeTime( start?: Date, end?: Date){
		this.startTime = start || this.startTime;
		this.endTime = end || this.endTime;

		this.range = undefined;
		this.surplus = false;

		this.examensObject = new Array();
	}

	changeRanges(ranges: TimeRange[]) {
		this.rangeList = ranges;
	}	


	changeParams( value: number ): void;
	changeParams( value: boolean ): void;
	changeParams( value: number | boolean ): void{
		if ( typeof value == 'string' ){
			value = parseInt(value);
		}
		if ( typeof value == 'number' ){
			if ( value && value < 5 ) { return; } 
			this.range = value || this.range;
		}
		if ( typeof value == 'boolean' ){
			this.surplus = value ;
		}
		this.divideRange();
	}

	private divideRange(){

		this.examensObject = new Array();

		let count: number;
		let mod = diffTime( this.startTime, this.endTime, 'minutes') % this.range;

		if ( mod > 0 && this.surplus ){
			count = Math.floor( diffTime( this.startTime, this.endTime, 'minutes') / this.range ) + 1;
		} else {
			count = Math.floor( diffTime( this.startTime, this.endTime, 'minutes') / this.range );
		}

		let index = 0;

		for(let i=0; i < count; i++){
			let tm = new Date( this.startTime );			
			tm.setMinutes(index);
			let mt = new Date( this.startTime );
			mt.setMinutes(index+this.range);

			this.examensObject.push( new FormExamenViewModel(tm, mt, undefined) );

			index += this.range;
		}
	}

	diffTime(){
		return diffTime( this.startTime, this.endTime, 'minutes');
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