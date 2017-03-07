import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
	selector: 'examens-add-form',
	templateUrl: './examens-add-form.component.html',
	styleUrls: [ './examens-add-form.component.css' ]
})

export class ExamensAddFormComponent implements OnInit {

	ngOnInit() {
		console.log('Add Examens');

		console.log($('#wizard').html() );

		$('#wizard').steps( {
				headerTag: "h2",
				bodyTag: "section",
				transitionEffect: "slideLeft"
			});
	}
}