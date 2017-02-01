import { DataManagerService } from './Shared/data-manager.service';
import { ServiceJsonService } from './service-json.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { DisciplineListComponent } from './discipline-list/discipline-list.component';


// var routerMaps = RouterModule.forRoot([
//     { path: 'discipline/:id', loadChildren: 'src/app/discipline.module' },
//     { path: '', component: AppComponent },
//     { path: '**', component: AppComponent }
// ]);


@NgModule({
  declarations: [
    AppComponent,
    DisciplineListComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [ServiceJsonService, DataManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
