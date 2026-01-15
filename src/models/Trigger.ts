import mongoose, { Schema, Model } from "mongoose";
import { TriggerTypes } from "../lib/enums";

/**
 * Plain interface (NO Document)
 * Next.js serialization safe
 */
export interface ITrigger {
  id: string;
  _id?: string;
  __v?: number;
  name: string;
  type: TriggerTypes;
  subAccountId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TriggerSchema = new Schema<ITrigger>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(TriggerTypes),
      required: true,
      index: true,
    },
    subAccountId: {
      type: String,
      ref: "SubAccount",
      required: true,
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
 * Optimized lookup indexes
 */
TriggerSchema.index({ subAccountId: 1, type: 1 });

export const Trigger: Model<ITrigger> =
  mongoose.models.Trigger ||
  mongoose.model<ITrigger>("Trigger", TriggerSchema);
