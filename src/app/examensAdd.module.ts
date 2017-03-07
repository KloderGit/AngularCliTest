import { ExamensAddFormComponent } from './Components/examens-add-form/examens-add-form.component';
import { TimepickerComponent } from './Components/timepicker/timepicker.component';
import { SliderComponent } from './Components/slider/slider.component';
import { ExamensAddComponent } from './Components/examens-add/examens-add.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';

export const routerConfig = [{
    path: '', component: ExamensAddFormComponent
    }];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routerConfig)],
    declarations: [ExamensAddFormComponent, ExamensAddComponent, SliderComponent, TimepickerComponent ]
})
export default class ExamensAddModule {}