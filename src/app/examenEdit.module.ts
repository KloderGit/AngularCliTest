import { ExamenEditItemModelComponent } from './Components/examen-edit-item-model/examen-edit-item-model.component';
import { ExamenEditComponent } from './Components/examen-edit/examen-edit.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';

export const routerConfig = [{
    path: '', component: ExamenEditComponent
}];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routerConfig)],
    declarations: [ExamenEditComponent, ExamenEditItemModelComponent]
})
export default class ExamensAddModule { }