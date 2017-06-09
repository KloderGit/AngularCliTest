import { DivideCountSelectorComponent } from './Components/examens-add-form/DivideRange/DivideSelector/divide-count-selector.component/divide-count-selector.component';
import { DivideTimeSelectorComponent } from './Components/examens-add-form/DivideRange/DivideSelector/divide-time-selector.component/divide-time-selector.component';
import { DivideRangesComponent } from './Components/examens-add-form/DivideRange/divide-ranges.component/divide-ranges.component';
import { AddRangeComponent } from './Components/examens-add-form/addRange/add-range.component/add-range.component';
import { FormStep1Component } from './Components/examens-add-form/Step1/form-step1.component/form-step1.component/form-step1.component';
import { WizardFormDirective } from './Directives/wizard-form.directive';
import { ExamensAddFormComponent } from './Components/examens-add-form/examens-add-form.component';
import { TimepickerComponent } from './Components/timepicker/timepicker.component';
import { SliderComponent } from './Components/slider/slider.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';

export const routerConfig = [
    { path: '/', component: ExamensAddFormComponent },    
    { path: '', component: ExamensAddFormComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routerConfig)],
    declarations: [ExamensAddFormComponent, SliderComponent, TimepickerComponent, DivideTimeSelectorComponent, DivideCountSelectorComponent,
    WizardFormDirective, FormStep1Component, AddRangeComponent, DivideRangesComponent]
})
export default class ExamensAddModule {}