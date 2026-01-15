import { connectDB } from '../lib/db';
import { Invitation, IInvitation } from '../models/Invitation';

export class InvitationService {
  static async findById(id: string): Promise<IInvitation | null> {
    await connectDB();
    try {
      const invitation = await Invitation.findById(id).lean();
      if (invitation) {
        // Clean up the invitation object for Next.js compatibility
        const { _id, __v, ...cleanInvitation } = invitation;
        cleanInvitation.id = cleanInvitation.id ?? _id?.toString();
        return cleanInvitation as IInvitation;
      }
      return null;
    } catch (error) {
      console.error('Error finding invitation by ID:', error);
      return null;
    }
  }

  static async findByEmail(email: string): Promise<IInvitation | null> {
    await connectDB();
    try {
      const invitation = await Invitation.findOne({ email }).lean();
      if (invitation) {
        // Clean up the invitation object for Next.js compatibility
        const { _id, __v, ...cleanInvitation } = invitation;
        cleanInvitation.id = cleanInvitation.id ?? _id?.toString();
        return cleanInvitation as IInvitation;
      }
      return null;
    } catch (error) {
      console.error('Error finding invitation by email:', error);
      return null;
    }
  }

  static async create(invitationData: Omit<IInvitation, '_id'>): Promise<IInvitation> {
    await connectDB();
    try {
      const invitation = new Invitation(invitationData);
      const savedInvitation = await invitation.save();
      // Clean up the invitation object for Next.js compatibility
      const invitationObj = savedInvitation.toObject();
      const { _id, __v, ...cleanResult } = invitationObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as IInvitation;
    } catch (error) {
      console.error('Error creating invitation:', error);
      throw error;
    }
  }

  static async update(id: string, invitationData: Partial<IInvitation>): Promise<IInvitation | null> {
    await connectDB();
    try {
      const updatedInvitation = await Invitation.findByIdAndUpdate(
        id,
        { ...invitationData, updatedAt: new Date() },
        { new: true }
      ).lean();
      
      if (updatedInvitation) {
        // Clean up the invitation object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedInvitation } = updatedInvitation;
        cleanUpdatedInvitation.id = cleanUpdatedInvitation.id ?? _id?.toString();
        return cleanUpdatedInvitation as IInvitation;
      }
      return null;
    } catch (error) {
      console.error('Error updating invitation:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectDB();
    try {
      const result = await Invitation.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting invitation:', error);
      return false;
    }
  }

  static async deleteByEmail(email: string): Promise<boolean> {
    await connectDB();
    try {
      const result = await Invitation.findOneAndDelete({ email });
      return !!result;
    } catch (error) {
      console.error('Error deleting invitation by email:', error);
      return false;
    }
  }
}