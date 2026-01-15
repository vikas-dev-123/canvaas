import mongoose, { Schema, Model } from "mongoose";

/**
 * Plain interface (NO Document)
 * Next.js 14 serialization safe
 */
export interface ITicketTag {
  id: string;
  _id?: string;
  __v?: number;
  ticketId: string;
  tagId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TicketTagSchema = new Schema<ITicketTag>(
  {
    ticketId: {
      type: String,
      ref: "Ticket",
      required: true,
      index: true,
    },
    tagId: {
      type: String,
      ref: "Tag",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,

    /**
     * _id → id conversion
     * Fixes: Objects with toJSON methods warning
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
 * Prevent duplicate tag assignment
 * One tag can appear only once per ticket
 */
TicketTagSchema.index(
  { ticketId: 1, tagId: 1 },
  { unique: true }
);

export const TicketTag: Model<ITicketTag> =
  mongoose.models.TicketTag ||
  mongoose.model<ITicketTag>("TicketTag", TicketTagSchema);
