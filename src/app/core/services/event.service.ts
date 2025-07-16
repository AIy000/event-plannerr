import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event, EventCategory } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly STORAGE_KEY = 'event-planner-events';
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  public events$ = this.eventsSubject.asObservable();

  constructor() {
    this.loadEvents();
  }

  private loadEvents(): void {
    const storedEvents = localStorage.getItem(this.STORAGE_KEY);
    if (storedEvents) {
      const events: Event[] = JSON.parse(storedEvents);
      this.eventsSubject.next(events);
    }
  }

  private saveEvents(events: Event[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
    this.eventsSubject.next(events);
  }

  getEvents(): Observable<Event[]> {
    return this.events$;
  }

  addEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newEvent: Event = {
      ...event,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentEvents = this.eventsSubject.value;
    const updatedEvents = [...currentEvents, newEvent];
    this.saveEvents(updatedEvents);
  }

  updateEvent(id: string, updatedEvent: Partial<Event>): void {
    const currentEvents = this.eventsSubject.value;
    const eventIndex = currentEvents.findIndex(event => event.id === id);
    
    if (eventIndex !== -1) {
      currentEvents[eventIndex] = {
        ...currentEvents[eventIndex],
        ...updatedEvent,
        updatedAt: new Date()
      };
      this.saveEvents(currentEvents);
    }
  }

  deleteEvent(id: string): void {
    const currentEvents = this.eventsSubject.value;
    const filteredEvents = currentEvents.filter(event => event.id !== id);
    this.saveEvents(filteredEvents);
  }

  getEventsByDate(date: string): Observable<Event[]> {
    return new Observable(observer => {
      this.events$.subscribe(events => {
        const filteredEvents = events.filter(event => event.date === date);
        observer.next(filteredEvents);
      });
    });
  }

  getEventsByCategory(category: EventCategory): Observable<Event[]> {
    return new Observable(observer => {
      this.events$.subscribe(events => {
        const filteredEvents = events.filter(event => event.category === category);
        observer.next(filteredEvents);
      });
    });
  }

  getUpcomingEvents(): Observable<Event[]> {
    return new Observable(observer => {
      this.events$.subscribe(events => {
        const now = new Date();
        const upcomingEvents = events.filter(event => {
          const eventDateTime = new Date(`${event.date}T${event.time}`);
          return eventDateTime > now;
        }).sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });
        observer.next(upcomingEvents);
      });
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}