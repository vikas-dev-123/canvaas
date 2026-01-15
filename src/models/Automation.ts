import mongoose, { Schema, Model } from "mongoose";

export interface IAutomation {
  id: string;
  _id?: string;
  __v?: number;
  name: string;
  triggerId?: string;
  published: boolean;
  subAccountId: string;
  createdAt: Date;
  updatedAt: Date;
}

const AutomationSchema = new Schema<IAutomation>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    triggerId: {
      type: String,
      ref: "Trigger",
      index: true,
    },
    published: {
      type: Boolean,
      default: false,
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

export const Automation: Model<IAutomation> =
  mongoose.models.Automation ||
  mongoose.model<IAutomation>("Automation", AutomationSchema);
