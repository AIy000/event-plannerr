import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Event, EventCategory } from '../../core/models/event.model';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent {
  @Input() event!: Event;
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();

  onDelete() {
    if (confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
      this.delete.emit(this.event.id);
    }
  }

  onEdit() {
    this.edit.emit(this.event.id);
  }

  getCategoryClass(): string {
    switch (this.event.category) {
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

  isUpcoming(): boolean {
    const now = new Date();
    const eventDateTime = new Date(`${this.event.date}T${this.event.time}`);
    return eventDateTime > now;
  }

  getTimeRemaining(): string {
    const now = new Date();
    const eventDateTime = new Date(`${this.event.date}T${this.event.time}`);
    const diff = eventDateTime.getTime() - now.getTime();
    
    if (diff < 0) return 'Geçti';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} gün kaldı`;
    if (hours > 0) return `${hours} saat kaldı`;
    return 'Yakında';
  }
}