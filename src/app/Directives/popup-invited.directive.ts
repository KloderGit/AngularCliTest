import { Directive, ElementRef, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
declare var $:any;

@Directive({
    selector: '[popup-invited]'
})
export class PopupInvitedDirective implements OnInit, OnDestroy{
    @Input() countExamens: number;
	@Input() currentStudentsInvited: number;
	@Input() percentage: number;

	@Output() eventAction = new EventEmitter();

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
					<li><a id='change-examens-day' data-action='change'>Перенос</a></li>
					<li><a id='copy-examens-day' data-action='copy'>Копировать</a></li>
					<li><a id='delete-examens-day' data-action='delete'>Удалить</a></li>
					<li role="separator" class="divider"></li>
					<li><a id='edit-examens-day' data-action='edit'>Редактировать</a></li>
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

		let shown = false;

		$(this.element.nativeElement).on('inserted.bs.popover', function () {
			let parent = $(this).data('bs.popover').$tip;
			parent.find('#change-examens-day, #copy-examens-day, #delete-examens-day, #edit-examens-day').on("click", function (event) {
				event.preventDefault();
				context.onDeleteEvent( $(this).data("action") );
			});
			shown = true;
		});

		$(this.element.nativeElement).on('hidden.bs.popover', function () {
			let parent = $(this).data('bs.popover').$tip;

			if (shown) { 
				parent.find('#change-examens-day, #copy-examens-day, #delete-examens-day, #edit-examens-day').unbind("click");
			}

			shown = false;

		});
    }

	onDeleteEvent( action ){
		this.eventAction.emit( action );
	}

	ngOnDestroy(){
		$(this.element.nativeElement).popover('destroy');
	}
}