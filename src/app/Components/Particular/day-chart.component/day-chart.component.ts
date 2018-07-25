import { uniqueFlatArray } from 'app/Shared/function';
import { RateModel } from './../../../Models/rate-model';
import { ExamenRowModel } from './../../../Models/examen-list-model';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { chartDayColors, chartRateNames } from "app/Shared/defines";
declare var $: any;

@Component({
	selector: 'day-chart',
	templateUrl: 'day-chart.component.html',
	styleUrls: ['day-chart.component.css']
})

export class DayChartComponent implements OnInit {
	jqueryChart: any;
	@Input() examens: ExamenRowModel[];
	@Input() rates: RateModel[];

	@Input() changeTriger;

	@ViewChild('pieChart') pieChart: ElementRef;

	ngOnInit() {
		let context = this;
		this.pieChart.nativeElement.innerHTML = '10,10,12,12,12';

		this.jqueryChart = $(this.pieChart.nativeElement);
		this.jqueryChart.peity("pie", {
			innerRadius: 40,
			radius: 70,
			// fill: fillColorsChart
			fill: ['#f77526', '#f7b826', '#d5f726', '#1cd2a1', '#ea4288', '#59cde0' ,'#dad5d2' ]
		});

		function fillColorsChart(_, i, all)  {
				console.log(_, i, all, context.typeRates());

				let ind = context.typeRates()[i];
				let val = context.selectColor(ind);

				if (i >= context.typeRates().length) {  return context.selectColor(0); }


				return val;
			}
	}

	ngOnChanges(changes) {
		let stringForChartData1: string = '';

		let options: string[] = Object.keys(chartDayColors);
		options = options.slice(options.length / 2);
		options.forEach( v => {
			stringForChartData1 += this.countRatePercentage(chartDayColors[v]);
			if (chartDayColors[v] !== 0) { stringForChartData1 += ','; }
		});	

		if (this.jqueryChart) {
			this.jqueryChart.text(stringForChartData1).change();
		}
	}

	percentage(x, y) {
		return Math.floor(100 / (y / x));
	}

	examsForDayListIDs() {
		return this.examens.filter(vm => vm.studentID).map(vm => vm.parentExamen.id);
	}

	examsForDayList() {
		return this.examens.filter(vm => vm.studentID);
	}

	ratesForDayList() {
		return this.rates.filter(rt => this.examsForDayListIDs().indexOf(rt.examenID) >= 0 && rt.value !=10);
	}

	// examenCountWithOutRate() {	
	// 	return this.examsForDayListIDs().filter(ex => this.ratesForDayList().map(r => r.examenID ? r.examenID : undefined).indexOf(ex) < 0);
	// }

	examenWithOutRate() {		
		return this.examsForDayList().filter(
			ex => { 			
				const ratesForEx = this.ratesForDayList().filter(rt => rt.examenID == ex.parentExamen.id && parseInt( rt.studentID ) == ex.studentID);			
				return ratesForEx.length > 0 ? false : true ;
			} 
		);
	}

	countRatePercentage(x) {
		let count;

		if (x === 0) {
			count = this.examenWithOutRate().map( ex => ex.parentExamen.id );
		} else {
			count = this.ratesForDayList().filter(rt => rt.value === x);
		}

		return this.percentage(count.length, this.examsForDayListIDs().length);
	}

	typeRates() {
		let types = this.ratesForDayList().filter(rt => rt.value ? true : false).map(rt => rt.value);
		types = uniqueFlatArray(types).map(t => parseInt(t)).sort();
		return types;
	}

	selectColor(x) {
		return chartDayColors[x];
	}
	selectName(x) {
		return chartRateNames[x];
	}


}