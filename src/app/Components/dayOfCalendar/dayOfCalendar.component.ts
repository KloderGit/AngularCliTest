import { ExamenModel } from './../../Models/examen-model';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

declare var $:any;

@Component({
	moduleId: module.id,
	selector: 'dayOfCalendar',
	templateUrl: 'dayOfCalendar.component.html',
	styleUrls: ['dayOfCalendar.component.css']
})

export class DayOfCalendarComponent implements OnInit, AfterViewInit, OnDestroy {
	@Input() examens: ExamenModel[];
	@ViewChild("popoverTag") popoverTag: ElementRef;
	@ViewChild("pieChart") pieChart: ElementRef;

	ngOnInit() {}

	ngAfterViewInit(){

		let popupString: string = `
			<div class = "content-of-popover">
				<p><strong>Всего эзаменов: ` + this.countExamensOfDay() +`</strong></p>
				<p>Занято - ` + this.currentStudentsInvited().length + ` (<strong>` + this.percentageOneInTwo( this.currentStudentsInvited().length, this.countExamensOfDay() ) + `%</strong>)</p>
				<div class="dropup">
				<button class="btn btn-info btn-sm btn-block dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Действия
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
					<li><a href="#">Перенос</a></li>
					<li><a href="#">Копировать</a></li>
					<li role="separator" class="divider"></li>
					<li><a href="#">Редактировать</a></li>
				</ul>
				</div>				
			</div>
			`;

		$(this.popoverTag.nativeElement).popover({
			'html':true,    
    		content: popupString
		});
	}

	currentStudentsInvited(){
		return	this.examens.map( item => item.students )
				.filter( items => items	
						.filter( item => item != null)
				.length > 0)
				.map(arr => arr.join());
	}

	countExamensOfDay(){
		return	this.examens.map(item => item.limit)
				.reduce( (previus, current) => { 	
					if ( previus == null ){ previus = 1; }				
					if ( current == null ){ return previus +1;
					} else { return previus + current; }
				 });
	}

	percentageOneInTwo( x, y ){
		return Math.floor( 100 / ( y / x ));
	}


	ngOnDestroy(){
		$(this.popoverTag.nativeElement).popover('destroy');
	}
}

