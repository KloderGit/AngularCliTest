import { ExamenEditRowComponent } from './Components/examen-edit-row/examen-edit-row.component';
import { StudentInfoComponent } from './Components/student-info/student-info.component';
import { ExamenEditItemModelComponent } from './Components/examen-edit-item-model/examen-edit-item-model.component';
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
    declarations: [ExamenEditComponent, ExamenEditItemModelComponent,
        AccordionItemDirective, StudentInfoComponent, ExamenEditRowComponent ]
})
export default class ExamensAddModule { }