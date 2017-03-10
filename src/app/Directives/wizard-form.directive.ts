import { RingList } from './../Shared/ring-list';
import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
declare var $: any;

@Directive({
    selector: '[wizard-form]'
})
export class WizardFormDirective implements OnInit, OnDestroy {

    @Input() titlesTag: string;
    slideCollection: ElementRef[] = [];
    titleCollection: ElementRef[] = [];

    ringContent: RingList;
    ringTitle: RingList;

    constructor( private element: ElementRef) { }

    ngOnInit() {     

        let context = this;

        this.slideCollection = $(this.element.nativeElement).children('div');
        this.ringContent = new RingList(this.slideCollection);
        this.activeSlide(this.ringContent.current());

        this.titleCollection = $(this.element.nativeElement).find('ul').children('li');
        this.ringTitle = new RingList(this.titleCollection);
        this.activeTitle(this.ringTitle.current());       

        $('[data-wizard-forward]').on('click', function () { 
            context.activeSlide(context.ringContent.next());
            context.activeTitle(context.ringTitle.next());            
        });
        $('[data-wizard-back]').on('click', function () {
            context.activeSlide(context.ringContent.prev());
            context.activeTitle(context.ringTitle.prev());                        
        });
    }

    activeSlide( element: any ): void { 
        $(this.slideCollection).hide();
        $(element).show();
    }    
    activeTitle( element: any) { 
        $(this.titleCollection).removeClass('active');
        $(element).addClass('active');
    }


    ngOnDestroy(): void {
        $('[data-wizard-back], [data-wizard-back]').unbind();
    }    

}