import mongoose, { Document, Schema } from 'mongoose';

export interface ITicketTag extends Document {
  id?: string; // Added for frontend compatibility
  ticketId: string;
  tagId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TicketTagSchema: Schema<ITicketTag> = new Schema({
  ticketId: { type: String, ref: 'Ticket', required: true, index: true },
  tagId: { type: String, ref: 'Tag', required: true, index: true },
}, {
  timestamps: true
});

// Ensure unique combination of ticketId and tagId
TicketTagSchema.index({ ticketId: 1, tagId: 1 }, { unique: true });

export const TicketTag = mongoose.models.TicketTag || mongoose.model<ITicketTag>('TicketTag', TicketTagSchema);