import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../../shared/info-dialog/info-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component'; // yol senin dizine göre uyarlanmalı

import { EventService } from '../../core/services/event.service';
import { Event, EventCategory } from '../../core/models/event.model';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  eventId: string | null = null;
  eventCategories = Object.values(EventCategory);

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    
  ) {
    this.eventForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.eventId = params['id'];
        this.loadEvent(params['id']);
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
      category: [EventCategory.PERSONAL, Validators.required]
    });
  }

  private loadEvent(id: string): void {
    this.eventService.getEvents().subscribe(events => {
      const event = events.find(e => e.id === id);
      if (event) {
        this.eventForm.patchValue({
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location,
          description: event.description,
          category: event.category
        });
      }
    });
  }

  onSubmit(): void {
  if (!this.eventForm.valid) return;

  const dateValue = this.eventForm.get('date')?.value;
  const year = new Date(dateValue).getFullYear();

  if (year > 9999) {
    this.dialog.open(InfoDialogComponent, {
      data: 'Tarih 4 basamaktan uzun. Lütfen geçerli bir tarih giriniz.'
    });
    return; // formu durdur
  }

  this.submitForm();
}




  onCancel(): void {
    this.router.navigate(['/']);
  }
  private submitForm(): void {
  const formValue = this.eventForm.value;

  if (this.isEditMode && this.eventId) {
    this.eventService.updateEvent(this.eventId, formValue);
  } else {
    this.eventService.addEvent(formValue);
  }

  this.router.navigate(['/']);
}


  get title() { return this.eventForm.get('title'); }
  get date() { return this.eventForm.get('date'); }
  get time() { return this.eventForm.get('time'); }
  get location() { return this.eventForm.get('location'); }
}