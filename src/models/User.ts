import mongoose, { Schema, Model } from "mongoose";
import { Role } from "../lib/enums";

/**
 * Plain interface (NO Document)
 * Next.js serialization safe
 */
export interface IUser {
  id: string;
  _id?: string;
  __v?: number;
  name: string;
  avatarUrl: string;
  email: string;
  role: Role;
  agencyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.SUBACCOUNT_USER,
      index: true,
    },
    agencyId: {
      type: String,
      ref: "Agency",
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
        const result = { ...ret };
        result.id = result.id ?? ret._id?.toString();
        delete (result as any)._id;
        delete (result as any).__v;
        return result;
      },
    },

    toObject: {
      virtuals: true,
      transform(doc, ret, options) {
        const result = { ...ret };
        result.id = result.id ?? ret._id?.toString();
        delete (result as any)._id;
        delete (result as any).__v;
        return result;
      },
    },
  }
);

/**
 * Optimized indexes
 */

UserSchema.index({ agencyId: 1, role: 1 });

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
