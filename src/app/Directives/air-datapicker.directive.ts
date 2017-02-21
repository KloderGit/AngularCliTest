import { Directive, ElementRef, OnInit, Input, OnDestroy } from '@angular/core';
import "../../../node_modules/air-datepicker/dist/js/datepicker.min"
import { random } from './../Shared/function';

declare var $:any;

@Directive({
    selector: '[air-datapicker]'
})
export class AirDataPickerDirective implements OnInit, OnDestroy{

    @Input() view: { view: string, minView: string } = { view: 'days', minView: 'days' };
    @Input() inline: boolean = false;
    @Input() dateFormat: string;
    @Input() timepicker: boolean = false;
    @Input() altFieldDateFormat: string;

    altFieldId = 'AlternateField' + random(10, 10000);

    constructor(private element: ElementRef){}

    ngOnInit() {
        this.init_plugin();
    }

    init_plugin(){
        $(this.element.nativeElement).parent().append(
            '<input style="display: none" type="text" id="' + this.altFieldId  + '"/>'
        );

        $(this.element.nativeElement).datepicker({
            view: this.view.view,
            minView: this.view.minView,
            inline: this.inline,
            dateFormat: this.dateFormat,
            autoClose: true,
            altField: "#" + this.altFieldId,
			altFieldDateFormat: this.altFieldDateFormat,
            showOtherMonths: true,
            timepicker: this.timepicker
		});
    }

    ngOnDestroy(){
        let myDatepicker = $(this.element.nativeElement).datepicker().data('datepicker');
        myDatepicker.destroy();       
    }
}