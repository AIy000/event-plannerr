import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { EventService } from './core/services/event.service';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfoDialogComponent } from './shared/info-dialog/info-dialog.component';


const routes: Routes = [
  { path: '', component: EventListComponent },
  { path: 'add', component: EventFormComponent },
  { path: 'edit/:id', component: EventFormComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    EventListComponent,
    EventFormComponent,
    ConfirmDialogComponent,
    InfoDialogComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule, // NgModel için gerekli
    MatDialogModule,
    MatButtonModule,
    RouterModule.forRoot(routes), BrowserAnimationsModule
  ],
  providers: [EventService],
  bootstrap: [AppComponent]
})
export class AppModule { }