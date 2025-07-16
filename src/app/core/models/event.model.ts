export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: EventCategory;
  createdAt: Date;
  updatedAt: Date;
}

export enum EventCategory {
  WORK = 'İş',
  PERSONAL = 'Kişisel',
  ENTERTAINMENT = 'Eğlence'
}