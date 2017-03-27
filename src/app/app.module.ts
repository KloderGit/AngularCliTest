import { DataManagerService } from './Services/data-manager.service';
import { MessagesService } from './Services/messages.service';
import { ServiceJsonService } from './Services/service-json.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { DisciplineListComponent } from './Components/discipline-list/discipline-list.component';
import { DataManagerStudentService } from "app/Services/data-manager-students.service";


var routerMaps = RouterModule.forRoot([
    { path: 'disciplines', component: DisciplineListComponent },
    { path: 'discipline/:id', loadChildren: './discipline.module' },
    { path: 'addexamens/:date/:discipline', loadChildren: './examensAdd.module' },
    { path: 'editexamens/:date/:discipline', loadChildren: './examenEdit.module' },   
    { path: '', component: DisciplineListComponent },
    { path: '**', component: DisciplineListComponent }
]);

@NgModule({
  imports: [ BrowserModule, HttpModule, routerMaps ],
  declarations: [ AppComponent, DisciplineListComponent ],
  providers: [ServiceJsonService, DataManagerService, MessagesService, DataManagerStudentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
