import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import './../../../node_modules/peity/jquery.peity.min';

declare var $:any;

@Directive({
    selector: '[pie-chart]'
})
export class PieChartDirective implements OnInit{
     
    @Input() innerRadius: number = 22;
    @Input() radius: number = 28;
    
    @Input() percent: { dig: number, in: number } = { dig: 0, in: 100 };

    constructor(private element: ElementRef){}

    ngOnInit(){
        this.element.nativeElement.innerHTML = this.percent.dig + ',' + this.percent.in;
        this.init_plugin();
    }

    init_plugin(){
		$(this.element.nativeElement).peity("pie", {
            innerRadius: this.innerRadius,
			radius: this.radius,
			fill: ["rgb(255, 173, 92)",  "#cccccc" ]
		});
    }
}