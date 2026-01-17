import mongoose, { Schema, Model } from "mongoose";

/**
 * Plain interface (NO Document)
 * Prevents Next.js serialization issues
 */
export interface ITicket {
  id: string;
  _id?: string;
  __v?: number;
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

const TicketSchema = new Schema<ITicket>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    laneId: {
      type: String,
      ref: "Lane",
      required: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    value: {
      type: Number,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    customerId: {
      type: String,
      ref: "Contact",
      index: true,
    },
    assignedUserId: {
      type: String,
      ref: "User",
      index: true,
    },
  },
  {
    timestamps: true,

    /**
     * Fix Next.js Server → Client serialization
     */
    toJSON: {
      virtuals: true,
      transform(doc, ret, options) {
        const { _id, __v, ...result } = ret;
        result.id = result.id ?? _id?.toString();
        return result;
      },
    },

    toObject: {
      virtuals: true,
      transform(doc, ret, options) {
        const { _id, __v, ...result } = ret;
        result.id = result.id ?? _id?.toString();
        return result;
      },
    },
  }
);

/**
 * Optimized indexes for Kanban / CRM views
 */
TicketSchema.index({ laneId: 1, order: 1 });


export const Ticket: Model<ITicket> =
  mongoose.models.Ticket ||
  mongoose.model<ITicket>("Ticket", TicketSchema);
