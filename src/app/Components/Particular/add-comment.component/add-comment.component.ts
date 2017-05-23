import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

declare var $: any;

@Component({
	selector: 'add-comment',
	templateUrl: 'add-comment.component.html',
	styleUrls: ['add-comment.component.css']
})

export class AddCommentComponent implements OnInit {

	@Input() comment: string;

	@ViewChild('toggleButton') toggleButton: ElementRef;
	@ViewChild('toogleContent') toogleContent: ElementRef;
	@ViewChild('buttonSave') buttonSave: ElementRef;

	@Output() onSave = new EventEmitter();

	commentOldValue: string = '';

	ngOnInit() {	
		const el = this.buttonSave.nativeElement;
		$(el).tooltip(
			{
				title: 'Дождитесь окончания действия.',
				trigger: 'manual',
				placement: 'left'
			}
		);		
	}

	tooglePanel() { 
		const b = this.toggleButton.nativeElement;
		const c = this.toogleContent.nativeElement;

		$(b).toggle();
		$(c).toggle();
	}	

	change(value) { 
		this.comment = value;
		console.log(this.comment);
		
	}

	saveActive() { 
		const res = this.comment + ' ';
		return res.replace(/\s+/g, '').length > 0 ? true: false;
	}

	saveComment() { 
		// const el = this.buttonSave.nativeElement;
		// $(el).tooltip('show');
		this.onSave.emit(this.comment);
		this.tooglePanel();
	}

	cancelComment() { 
		this.tooglePanel();
	}

	commentFormText() { 
		return this.comment ? this.comment : '';
	}

	
	
}