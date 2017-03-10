import { RingList } from './../Shared/ring-list';
import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
declare var $: any;

@Directive({
    selector: '[wizard-form]'
})
export class WizardFormDirective implements OnInit, OnDestroy {

    @Input() titlesTag: string;
    slideCollection: ElementRef[] = [];

    ringContent: RingList;

    constructor( private element: ElementRef) { }

    ngOnInit() {     

        let context = this;

        let titles: ElementRef[] = [];
        this.slideCollection = $(this.element.nativeElement).children('div');
        this.ringContent = new RingList(this.slideCollection);

        this.activeSlide(this.ringContent.current());
        

        for (let i = 0; i < this.slideCollection.length; i++) { 
            titles.push($(this.slideCollection[i]).children(this.titlesTag).first());
        }

        $(this.element.nativeElement).prepend('<ul class="wizard-top-menu"></ul>');
                
        for (let i = titles.length - 1; i >= 0; i--) {
            let liItem = $('<li>' + titles[i][0].innerText + '</li>');
            $('.wizard-top-menu').first().prepend(liItem);
        }
    

        $('[data-wizard-forward]').on('click', function () { 
            context.activeSlide(context.ringContent.next());
        });
        $('[data-wizard-back]').on('click', function () {
            context.activeSlide(context.ringContent.prev());
        });

    }


    activeSlide( element: any ): void { 
        $(this.slideCollection).hide();
        $(element).show();
        // $('.wizard-top-menu').children().removeClass("active");
        // let ulTabs = $('.wizard-top-menu').children();

        console.log($('ul') );

        // ulTabs[this.ringContent.getIndex()].addClass("active");
    }    


    ngOnDestroy(): void {
        $('[data-wizard-back], [data-wizard-back]').unbind();
    }    

}