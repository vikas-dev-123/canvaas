import mongoose, { Schema, Model } from "mongoose";
import { ActionType } from "../lib/enums";

export interface IAction {
  id: string;
  _id?: string;
  __v?: number;
  name: string;
  type: ActionType;
  automationId: string;
  order: number;
  laneId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActionSchema = new Schema<IAction>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(ActionType),
      required: true,
    },
    automationId: {
      type: String,
      ref: "Automation",
      required: true,
      index: true,
    },
    order: {
      type: Number,
      required: true,
    },
    laneId: {
      type: String,
      default: "0",
    },
  },
  {
    timestamps: true,
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

export const Action: Model<IAction> =
  mongoose.models.Action || mongoose.model<IAction>("Action", ActionSchema);
