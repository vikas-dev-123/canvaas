import mongoose, { Schema, Model } from "mongoose";

export interface INotification {
  id: string;
  _id?: string;
  __v?: number;
  notification: string;
  agencyId: string;
  subAccountId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    notification: {
      type: String,
      required: true,
      trim: true,
    },
    agencyId: {
      type: String,
      ref: "Agency",
      required: true,
      index: true,
    },
    subAccountId: {
      type: String,
      ref: "SubAccount",
      index: true,
    },
    userId: {
      type: String,
      ref: "User",
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

export const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
