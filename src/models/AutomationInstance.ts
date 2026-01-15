import mongoose, { Schema, Model } from "mongoose";

export interface IAutomationInstance {
  id: string;
  _id?: string;
  __v?: number;
  automationId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AutomationInstanceSchema = new Schema<IAutomationInstance>(
  {
    automationId: {
      type: String,
      ref: "Automation",
      required: true,
      index: true,
    },
    active: {
      type: Boolean,
      default: false,
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

export const AutomationInstance: Model<IAutomationInstance> =
  mongoose.models.AutomationInstance ||
  mongoose.model<IAutomationInstance>(
    "AutomationInstance",
    AutomationInstanceSchema
  );
