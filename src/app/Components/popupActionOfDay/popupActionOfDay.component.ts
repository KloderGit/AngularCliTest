import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

declare var $: any;

@Component({
	selector: 'popupActionOfDay',
	templateUrl: 'popupActionOfDay.component.html',
	styleUrls: ['popupActionOfDay.component.css']
})

export class PopupActionOfDayComponent implements OnInit {

	@Input() initialElement;

	@ViewChild("selfElement") selfElement: ElementRef;

	ngOnInit() {
		this.initialElement = $(this.initialElement);
		let position = $(this.initialElement).offset();

		console.log(position);

		let wraperWidth = $(this.initialElement).width();
		let selfWith = $(this.selfElement.nativeElement).width();
		let selfHeight = $(this.selfElement.nativeElement).height();

		$(this.selfElement.nativeElement).offset({	top: 0 - selfHeight - 10, 
													left: 0 - selfWith/2 + wraperWidth/2});
	}
}