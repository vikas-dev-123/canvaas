import mongoose, { Schema, Model } from "mongoose";

/**
 * Plain interface (NO Document)
 * Prevents Next.js serialization issues
 */
export interface ISubAccount {
  id: string; // UUID v4 (primary app-level ID)
  _id?: string;
  __v?: number;
  connectAccountId?: string;
  name: string;
  subAccountLogo?: string;
  companyEmail?: string;
  companyPhone: string;
  goal: number;
  address: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
  agencyId: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubAccountSchema = new Schema<ISubAccount>(
  {
    id: {
      type: String,
      required: true,
      unique: true, // UUID uniqueness
      index: true,
    },
    connectAccountId: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subAccountLogo: {
      type: String,
    },
    companyEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    companyPhone: {
      type: String,
      required: true,
      trim: true,
    },
    goal: {
      type: Number,
      default: 5,
      min: 0,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
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
  },
  {
    timestamps: true,

    /**
     * Fix Next.js Server → Client warnings
     * _id → id cleanup
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
 * Optimized query indexes
 */
SubAccountSchema.index({ agencyId: 1, createdAt: -1 });

export const SubAccount: Model<ISubAccount> =
  mongoose.models.SubAccount ||
  mongoose.model<ISubAccount>("SubAccount", SubAccountSchema);
