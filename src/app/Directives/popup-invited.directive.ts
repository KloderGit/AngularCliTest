import { Directive, ElementRef, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
declare var $:any;

@Directive({
    selector: '[popup-invited]'
})
export class PopupInvitedDirective implements OnInit, OnDestroy{
	@Output() eventAction = new EventEmitter();

    constructor(private element: ElementRef){}

    ngOnInit(){
		let popupString: string = `
			<div class = "content-of-popover">
				<p><strong>Действия:</strong> </p>
				<div class="btn-group-vertical" role="group">
				<button id='change-examens-day' data-action='change' type="button" class="btn btn-info">Перенос</button>
				<button id='copy-examens-day' data-action='copy' type="button" class="btn btn-info">Копировать</button>
				<button id='delete-examens-day' data-action='delete' type="button" class="btn btn-danger">Удалить</button>
				<hr style="margin: 5px;"/>
				<button id='edit-examens-day' data-action='edit' type="button" class="btn btn-success">Редактировать</button>
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