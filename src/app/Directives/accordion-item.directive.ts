import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
declare var $: any;

@Directive({
    selector: '[accordion-item]'
})
export class AccordionItemDirective implements OnInit, OnDestroy {

    @Input() slideElement: string;

    constructor(private element: ElementRef) { }

    ngOnInit() {
        let context = this;
        $(this.element.nativeElement).on('click', function (e) { 
            e.preventDefault();
            context.slideToogle();
        });
    }

    slideToogle(): void {
        let child = this.element.nativeElement.attributes.target.nodeValue;
       
        $('.collapse').hide();

        $(child).show();
    }



    ngOnDestroy(): void {
        $(this.element.nativeElement).unbind();
    }

}