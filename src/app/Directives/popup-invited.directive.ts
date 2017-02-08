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

    constructor(private element: ElementRef){}

    ngOnInit(){
		let popupString: string = `
			<div class = "content-of-popover">
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
		let context = this;
		$(this.element.nativeElement).popover({
			'html':true,    
    		content: popupString
		});

		$(this.element.nativeElement).on('inserted.bs.popover', function () {
			$(this).data('bs.popover').$tip.find('#perenos').on("click", function(){
				console.log('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
				emite();
			});
		});
		$(this.element.nativeElement).on('hidden.bs.popover', function () {
			$(this).data('bs.popover').$tip.find('#perenos').unbind("click");
		});

		function emite(){
			context.eventDelete.emit('delete');
		}
    }

	onDeleteEvent(){
		console.log('dir');
		this.eventDelete.emit('delete');
	}

	ngOnDestroy(){
		$(this.element.nativeElement).popover('destroy');
	}
}