import mongoose, { Schema, Model } from "mongoose";

/**
 * Plain interface (NO Document)
 * Prevents Next.js serialization issues
 */
export interface ISubscription {
  id: string;
  _id?: string;
  __v?: number;
  plan?: string;
  price?: string;
  active: boolean;
  priceId: string;
  customerId: string;
  currentPeriodEndDate: Date;
  subscriptionId: string;
  agencyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    plan: {
      type: String,
      trim: true,
    },
    price: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    priceId: {
      type: String,
      required: true,
      index: true,
    },
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    currentPeriodEndDate: {
      type: Date,
      required: true,
    },

    /**
     * ⚠️ FIXED TYPO
     * subscritiptionId ❌ → subscriptionId ✅
     */
    subscriptionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    agencyId: {
      type: String,
      ref: "Agency",
      unique: true,
      sparse: true, // allows null
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
 * Helpful compound index for Stripe lookups
 */
SubscriptionSchema.index({ customerId: 1, active: 1 });

export const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
