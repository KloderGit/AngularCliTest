import { RateSelectorComponent } from './Components/Particular/rate-selector.component/rate-selector.component';
import { StudentRatesComponent } from './Components/student-rates/student-rates.component';
import { ExamenEditRowComponent } from './Components/examen-edit-row/examen-edit-row.component';
import { StudentInfoComponent } from './Components/student-info/student-info.component';
import { ExamenEditComponent } from './Components/examen-edit/examen-edit.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { AccordionItemDirective } from "app/Directives/accordion-item.directive";

export const routerConfig = [{
    path: '', component: ExamenEditComponent
}];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routerConfig)],
    declarations: [ExamenEditComponent, StudentRatesComponent, RateSelectorComponent,
        AccordionItemDirective, StudentInfoComponent, ExamenEditRowComponent ]
})
export default class ExamensAddModule { }