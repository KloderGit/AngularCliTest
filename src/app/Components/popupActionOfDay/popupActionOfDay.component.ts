import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { random } from './../../Shared/function';

declare var $: any;

@Component({
	selector: 'popupActionOfDay',
	templateUrl: 'popupActionOfDay.component.html',
	styleUrls: ['popupActionOfDay.component.css']
})

export class PopupActionOfDayComponent implements OnInit {

	@Input() initialElement;
	@ViewChild("selfElement") selfElement: ElementRef;

	@Output() eventAction = new EventEmitter();

	constructor(){}

	ngOnInit() {
		this.initialElement = $(this.initialElement);
		let position = $(this.initialElement).offset();

		let wraperWidth = $(this.initialElement).width();
		let selfWith = $(this.selfElement.nativeElement).width();
		let selfHeight = $(this.selfElement.nativeElement).height();

		$(this.selfElement.nativeElement).offset({	top: 0 - selfHeight - 10, 
			left: 0 - selfWith / 2 + wraperWidth / 2
		});
	}

	onActionEvent( action: string ){
		this.eventAction.emit( action );
	}

	changeDate( inputElement ) {
		let altInputId = $(inputElement).siblings('input').attr('id');
		let value = $('#' + altInputId).val();
		this.onActionEvent('change');
	}

	copyDate(inputElement ){
		let altInputId = $(inputElement).siblings('input').attr('id');
		let value = $('#' + altInputId).val();
		this.onActionEvent('copy');
	}

	selectDayChange(){
		$(this.selfElement.nativeElement).find('.selectDayCopy').hide();
		$(this.selfElement.nativeElement).find('.selectDayChange').toggle();
	}
	selectDayCopy(){
		$(this.selfElement.nativeElement).find('.selectDayChange').hide();
		$(this.selfElement.nativeElement).find('.selectDayCopy').toggle();
	}
}