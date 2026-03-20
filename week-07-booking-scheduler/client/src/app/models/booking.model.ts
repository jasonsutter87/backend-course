import { TimeSlot } from './time-slot.model';

export interface Booking {
  id: number;
  timeSlotId: number;
  timeSlot?: TimeSlot;
  customerName: string;
  customerEmail: string;
  bookedAt: string;
}
