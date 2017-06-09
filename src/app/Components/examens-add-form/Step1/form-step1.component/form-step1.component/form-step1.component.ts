import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'form-step1',
	templateUrl: 'form-step1.component.html',
	styleUrls: ['form-step1.component.css']
})

export class FormStep1Component implements OnInit {

	@Output() onChange = new EventEmitter();

	ngOnInit() { }

	change( type ) {
		this.onChange.emit(type);
	}
}