import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilService {
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  formatDateTime(date: string, time: string): string {
    return `${this.formatDate(date)} ${this.formatTime(time)}`;
  }

  isToday(date: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  }

  isTomorrow(date: string): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date === tomorrow.toISOString().split('T')[0];
  }

  isThisWeek(date: string): boolean {
    const eventDate = new Date(date);
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    return eventDate >= weekStart && eventDate <= weekEnd;
  }

  getRelativeDate(date: string): string {
    if (this.isToday(date)) return 'Bugün';
    if (this.isTomorrow(date)) return 'Yarın';
    if (this.isThisWeek(date)) return 'Bu hafta';
    return this.formatDate(date);
  }

  sortEventsByDateTime(events: any[]): any[] {
    return events.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  }
}