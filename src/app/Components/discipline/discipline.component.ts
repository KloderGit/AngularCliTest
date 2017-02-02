import { DisciplineModel } from './../../Models/discipline-model';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'discipline',
	templateUrl: 'discipline.component.html'
})

export class DisciplineComponent implements OnInit {

	discipline: DisciplineModel;

	ngOnInit() { }
}