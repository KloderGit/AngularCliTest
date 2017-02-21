import { PopupInvitedDirective } from './Directives/popup-invited.directive';
import { PieChartDirective } from './Directives/pie-chart.directive';
import { AirDataPickerDirective } from './Directives/air-datapicker.directive';
import { ExamensForDayPipe } from './Pipes/examens-for-day';
import { DayOfCalendarComponent } from './Components/dayOfCalendar/dayOfCalendar.component';
import { ExamensForMonthPipe } from './Pipes/examens-month.pipe';
import { ObjectToTimestampPipe } from './Pipes/obj-timestamp.pipe';
import { CalendarComponent } from './Components/calendar/calendar.component';
import { DisciplineComponent } from './Components/discipline/discipline.component';
import { PopupActionOfDayComponent } from './Components/popupActionOfDay/popupActionOfDay.component'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export const routerConfig = [
        { path: '/', component: DisciplineComponent },
        { path: '', component: DisciplineComponent }
    ];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routerConfig)],
  declarations: [ DisciplineComponent, CalendarComponent, ObjectToTimestampPipe, ExamensForMonthPipe, PopupActionOfDayComponent,
  DayOfCalendarComponent, ExamensForDayPipe, AirDataPickerDirective, PieChartDirective, PopupInvitedDirective ]
})

export default class DisciplineModule { }
