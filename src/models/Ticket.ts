import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket extends Document {
  id?: string; // Added for frontend compatibility
  name: string;
  laneId: string;
  order: number;
  value?: number;
  description?: string;
  customerId?: string;
  assignedUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema: Schema<ITicket> = new Schema({
  name: { type: String, required: true },
  laneId: { type: String, ref: 'Lane', required: true, index: true },
  order: { type: Number, default: 0 },
  value: { type: Number },
  description: { type: String },
  customerId: { type: String, ref: 'Contact', index: true },
  assignedUserId: { type: String, ref: 'User', index: true },
}, {
  timestamps: true
});

export const Ticket = mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);