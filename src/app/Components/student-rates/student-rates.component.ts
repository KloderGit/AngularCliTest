import {
  getDateString,
  uniqueFlatArray
} from 'app/Shared/function';
import {
  DataManagerService
} from './../../Services/data-manager.service';
import {
  RateModel
} from './../../Models/rate-model';
import {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'student-rates',
  templateUrl: 'student-rates.component.html',
  styleUrls: ['student-rates.component.css']
})

export class StudentRatesComponent implements OnInit {

  @Input() rates: RateModel[];
  dateToString = getDateString;
  unique = uniqueFlatArray;

  constructor(private dataManager: DataManagerService) {}

  ngOnInit() {}

  getDiscipline(id) {
    return this.dataManager.getDisciplineByID(id);
  }


  groupby() {
    let res = [];

    let disciplineIDs = [];

    for (let i = 0; i < this.rates.length; i++) {
      if (this.rates[i].examen) {
        if (this.rates[i].examen.disciplineId) { 
          disciplineIDs.push(this.rates[i].examen.disciplineId);
        }
      }
    }

	if (disciplineIDs.length > 0) { 
		disciplineIDs = this.unique(disciplineIDs);

		for (var i = 0; i < disciplineIDs.length; i++) {
			let name = this.dataManager.getDisciplineByID(disciplineIDs[i]).title;

			let rat = this.rates.filter(item => item.examen.disciplineId == disciplineIDs[i]);

			let rr = rat.map(item => {
				return {
					tm: item.examen.startTime,
					vl: item.value
				}
			});

			res.push({
				title: name,
				rates: rr
			});
		}
	}
    return res;
  }

}
