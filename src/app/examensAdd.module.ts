import { AddRangeComponent } from './Components/examens-add-form/addRange/add-range.component/add-range.component';
import { FormStep1Component } from './Components/examens-add-form/Step1/form-step1.component/form-step1.component/form-step1.component';
import { WizardFormDirective } from './Directives/wizard-form.directive';
import { ExamensAddFormComponent } from './Components/examens-add-form/examens-add-form.component';
import { TimepickerComponent } from './Components/timepicker/timepicker.component';
import { SliderComponent } from './Components/slider/slider.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';

export const routerConfig = [{
    path: '', component: ExamensAddFormComponent
    }];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routerConfig)],
    declarations: [ExamensAddFormComponent, SliderComponent, TimepickerComponent, WizardFormDirective, FormStep1Component, AddRangeComponent ]
})
export default class ExamensAddModule {}