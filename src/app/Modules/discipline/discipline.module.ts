import { DisciplineComponent } from './../../Components/discipline/discipline.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export const routerConfig = [
        { path: '/', component: DisciplineComponent },
        { path: '', component: DisciplineComponent }
    ];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routerConfig)],
  declarations: [ DisciplineComponent ]
})

export default class DisciplineModule { }
