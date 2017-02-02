import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { addFirstZero } from './../../Shared/function'

@Component({
	selector: 'timepicker',
	templateUrl: 'timepicker.component.html',
	styleUrls: ['timepicker.component.css']
})

export class TimepickerComponent implements OnInit {

	@Input() value: { hours: number, minutes: number } = { hours: undefined, minutes: undefined };

 	@Input() defaultHour: number = 10;
	@Input() defaultMinute: number = 0;
	@Input() onlyHours: boolean = false;
	@Output() onChangeTimePicker = new EventEmitter<Object>();

	minSliderHours: number = 9; 
	maxSliderHours: number = 23;
	minSliderMinutes: number = 0; 
	maxSliderMinutes: number = 59;
	@Input() hourMinLimit: number = this.minSliderHours;
	@Input() hourMaxLimit: number = this.maxSliderHours;
	@Input() minutesMinLimit: number = this.minSliderMinutes;
	@Input() minutesMaxLimit: number = this.maxSliderMinutes;	

	ngOnInit() {
		this.value.hours = this.defaultHour;
		this.value.minutes = this.defaultMinute;
		this.onChangeTimePicker.emit( this.value );
	}

	changeHours( hours: number ){
			this.value.hours = hours;
			this.onChangeTimePicker.emit( this.value );
	}

	changeMinutes( minutes: number ){
			this.value.minutes = minutes;
			this.onChangeTimePicker.emit( this.value );
	}

	formatTimeDigit(n){		
		return addFirstZero( n );
	}
}