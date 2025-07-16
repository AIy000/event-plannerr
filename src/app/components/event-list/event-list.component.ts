import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';
import { Event, EventCategory } from '../../core/models/event.model';
import { EventService } from '../../core/services/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events$: Observable<Event[]>;
  filteredEvents: Event[] = [];
  selectedCategory: EventCategory | 'all' = 'all';
  selectedDate: string = '';
  viewMode: 'list' | 'calendar' = 'list';

  eventCategories = Object.values(EventCategory);

  constructor(
    private eventService: EventService,
    private dialog: MatDialog
  ) {
    this.events$ = this.eventService.getEvents();
  }

  ngOnInit(): void {
    this.events$.subscribe(events => {
      this.filteredEvents = events;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.events$.subscribe(events => {
      let filtered = events;

      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(event => event.category === this.selectedCategory);
      }

      if (this.selectedDate) {
        filtered = filtered.filter(event => event.date === this.selectedDate);
      }

      // Tarihe göre sıralama
      filtered.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });

      this.filteredEvents = filtered;
    });
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onDateChange(): void {
    this.applyFilters();
  }

  onViewModeChange(): void {
    // Görünüm modu değişimi
  }

  deleteEvent(eventId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Bu etkinliği silmek istediğinizden emin misiniz?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.deleteEvent(eventId);
      }
    });
  }

  getCategoryClass(category: EventCategory): string {
    switch (category) {
      case EventCategory.WORK:
        return 'category-work';
      case EventCategory.PERSONAL:
        return 'category-personal';
      case EventCategory.ENTERTAINMENT:
        return 'category-entertainment';
      default:
        return '';
    }
  }

  isUpcoming(event: Event): boolean {
    const now = new Date();
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    return eventDateTime > now;
  }
}
