import mongoose, { Schema, Model } from "mongoose";
import { Role, InvitationStatus } from "../lib/enums";

export interface IInvitation {
  id: string;
  _id?: string;
  __v?: number;
  email: string;
  agencyId: string;
  status: InvitationStatus;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const InvitationSchema = new Schema<IInvitation>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    agencyId: {
      type: String,
      ref: "Agency",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(InvitationStatus),
      default: InvitationStatus.PENDING,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.SUBACCOUNT_USER,
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

export const Invitation: Model<IInvitation> =
  mongoose.models.Invitation ||
  mongoose.model<IInvitation>("Invitation", InvitationSchema);
