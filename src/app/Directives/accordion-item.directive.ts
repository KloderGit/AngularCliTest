import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
declare var $: any;

@Directive({
    selector: '[accordion-item]'
})
export class AccordionItemDirective implements OnInit, OnDestroy {

    @Input() slideElement: string;

    constructor(private element: ElementRef) { }

    ngOnInit() {
        const context = this;
        $(this.element.nativeElement).on('click', function (e) {
            e.preventDefault();
            context.slideToogle();
        });
    }

    slideToogle(): void {

        const rootDiv = $(this.element.nativeElement).parent().parent().parent();
        const child = rootDiv.find('.collapse');
        const isVis = child.is(':visible');

        // let child = this.element.nativeElement.attributes.target.nodeValue;

        $('.collapse').hide();
        $('.app-panel').removeClass('selectedBox');

        if (!isVis) {
            $(child).show();
            $(rootDiv).addClass('selectedBox');
        } else {
            $(child).hide();
        }

        // $(child).show();

    }

    ngOnDestroy(): void {
        $(this.element.nativeElement).unbind();
    }

}
