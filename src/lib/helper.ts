import mongoose from "mongoose";

export function toObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid MongoDB ObjectId");
  }
  return new mongoose.Types.ObjectId(id);
}

export function serializeDoc<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}
