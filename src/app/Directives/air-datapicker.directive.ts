import { Directive, ElementRef, OnInit, Input, OnDestroy } from '@angular/core';
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
    
    constructor(private element: ElementRef){}

    ngOnInit(){
        this.init_plugin();
    }

    init_plugin(){
        $(this.element.nativeElement).parent().append(
            `<input 
                style="display: none"
                type="text"
                id="` + this.element.nativeElement.id  + `-alternate"/>
            `
        );

        $(this.element.nativeElement).datepicker({
            view: this.view.view,
            minView: this.view.minView,
            inline: this.inline,
            dateFormat: this.dateFormat,
			altField: "#" + this.element.nativeElement.id  + "-alternate",
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