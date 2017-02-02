import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

	declare var $: any;

@Component({
	selector: 'slider',
	templateUrl: 'slider.component.html',
	styleUrls: ['slider.component.css']	
})

export class SliderComponent implements OnInit {

	@ViewChild("slider") slider: ElementRef;

	@Input() min: number = 0;
	@Input() max: number = 100;
	@Input() value: string = '10';

	@Input() minLimit: number = this.min;
	@Input() maxLimit: number = this.max;

	@Output() onChangeSlider = new EventEmitter();

	ngOnInit() {
		let context = this;

		this.slider.nativeElement.addEventListener("input", function() {
			if ( this.value < context.minLimit ){
				this.value = context.value;
			}
			context.value = this.value;
			context.onChangeSlider.emit( parseInt(this.value) );
		}, false);

		this.onChangeSlider.emit( parseInt(this.value) );
	}
}