import mongoose, { Schema, Model } from "mongoose";

/**
 * Plain interface (NO Document)
 * Safe for Next.js Server → Client
 */
export interface IPermissions {
  id: string;
  _id?: string;
  __v?: number;
  email: string;
  subAccountId: string;
  access: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionsSchema = new Schema<IPermissions>(
  {
    email: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    subAccountId: {
      type: String,
      ref: "SubAccount",
      required: true,
      index: true,
    },
    access: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,

    /**
     * Fix Next.js serialization warnings
     * Convert _id → id
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
 * Prevent duplicate permissions for same user + subaccount
 */
PermissionsSchema.index(
  { email: 1, subAccountId: 1 },
  { unique: true }
);

export const Permissions: Model<IPermissions> =
  mongoose.models.Permissions ||
  mongoose.model<IPermissions>("Permissions", PermissionsSchema);
