import { DayChartComponent } from './Components/Particular/day-chart.component/day-chart.component';
import { AddCommentComponent } from './Components/Particular/add-comment.component/add-comment.component';
import { RateSelectorComponent } from './Components/Particular/rate-selector.component/rate-selector.component';
import { StudentRatesComponent } from './Components/student-rates/student-rates.component';
import { ExamenEditRowComponent } from './Components/examen-edit-row/examen-edit-row.component';
import { StudentInfoComponent } from './Components/student-info/student-info.component';
import { ExamenEditComponent } from './Components/examen-edit/examen-edit.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { AccordionItemDirective } from "app/Directives/accordion-item.directive";
import { ExamensRowOrderPipe } from 'app/Pipes/examen-row-order.pipe';

export const routerConfig = [
    { path: '/', component: ExamenEditComponent },    
    { path: '', component: ExamenEditComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routerConfig)],
    declarations: [ExamenEditComponent, StudentRatesComponent, RateSelectorComponent, AddCommentComponent, DayChartComponent,
        AccordionItemDirective, StudentInfoComponent, ExamenEditRowComponent, ExamensRowOrderPipe ]
})
export default class ExamensEditModule { }