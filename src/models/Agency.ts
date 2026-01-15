import mongoose, { Schema, Model } from "mongoose";

export interface IAgency {
  id: string; // UUID v4 (primary app-level ID)
  _id?: string;
  __v?: number;
  connectAccountId?: string;
  customerId: string;
  name: string;
  agencyLogo: string;
  companyEmail: string;
  companyPhone: string;
  whiteLabel: boolean;
  address: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
  goal: number;
  subscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AgencySchema = new Schema<IAgency>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    connectAccountId: {
      type: String,
      default: "",
      index: true,
    },
    customerId: {
      type: String,
      default: "",
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    agencyLogo: {
      type: String,
      required: true,
    },
    companyEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    companyPhone: {
      type: String,
      required: true,
      trim: true,
    },
    whiteLabel: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    goal: {
      type: Number,
      default: 5,
    },
    subscriptionId: {
      type: String,
      ref: "Subscription",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret, options) {
        const { _id, __v, ...rest } = ret;
        rest.id = rest.id ?? _id?.toString();
        return rest;
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret, options) {
        const { _id, __v, ...rest } = ret;
        rest.id = rest.id ?? _id?.toString();
        return rest;
      },
    },
  }
);

export const Agency: Model<IAgency> =
  mongoose.models.Agency || mongoose.model<IAgency>("Agency", AgencySchema);
