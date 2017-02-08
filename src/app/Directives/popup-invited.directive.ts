import { Directive, ElementRef, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
declare var $:any;

@Directive({
    selector: '[popup-invited]'
})
export class PopupInvitedDirective implements OnInit, OnDestroy{
    @Input() countExamens: number;
	@Input() currentStudentsInvited: number;
	@Input() percentage: number;

	@Output() eventDelete = new EventEmitter();

	idGen;

    constructor(private element: ElementRef){
		this.idGen = Math.floor(Math.random() * (10000 - 1000)) + 1000;		
	}

    ngOnInit(){
		let gen = this.idGen;
		let popupString: string = `
			<div id="` + gen + `" class = "content-of-popover">
				<p><strong>Всего эзаменов: ` + this.countExamens +`</strong></p>
				<p>Занято - ` + this.currentStudentsInvited + ` (<strong>` + this.percentage + `%</strong>)</p>
				<div class="dropup">
				<button class="btn btn-info btn-sm btn-block dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Действия
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
					<li><button id='perenos'>Перенос</button></li>
					<li><a href="#">Копировать</a></li>
					<li role="separator" class="divider"></li>
					<li><a href="#">Редактировать</a></li>
				</ul>
				</div>				
			</div>
			`;        
			
			this.init_plugin( popupString );
    }

    init_plugin( popupString: string ){

		let cnx = this;

		$(this.element.nativeElement).popover({
			'html':true,    
    		content: popupString
		});

			let str = '#' + cnx.idGen + ' ' + '#perenos';
			console.log(str);

			$(str).on("show", function(e){
				console.log('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
			});


		// $('#' + this.idGen + ' ' + '#perenos').on("click", function(e){
		// 	e.preventDefault();
		// 	console.log('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
		// });
    }

	onDeleteEvent(){
		console.log('dir');
		this.eventDelete.emit('delete');
	}

	ngOnDestroy(){
		$(this.element.nativeElement).popover('destroy');
	}
}