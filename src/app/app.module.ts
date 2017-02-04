import { MessagesService } from './Services/messages.service';
import { DataManagerService } from './Shared/data-manager.service';
import { ServiceJsonService } from './Services/service-json.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { DisciplineListComponent } from './Components/discipline-list/discipline-list.component';


var routerMaps = RouterModule.forRoot([
    { path: 'disciplines', component: DisciplineListComponent },
    { path: 'discipline/:id', loadChildren: './discipline.module' },
    { path: 'addexamens/:date/:discipline', loadChildren: './examensAdd.module' },    
    { path: '', component: DisciplineListComponent },
    { path: '**', component: DisciplineListComponent }
]);

@NgModule({
  imports: [ BrowserModule, HttpModule, routerMaps ],
  declarations: [ AppComponent, DisciplineListComponent ],
  providers: [ServiceJsonService, DataManagerService, MessagesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
