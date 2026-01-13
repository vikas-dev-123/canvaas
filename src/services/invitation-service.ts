import { connectToDatabase } from '../lib/db';
import { Invitation, IInvitation } from '../models/Invitation';

export class InvitationService {
  static async findById(id: string): Promise<IInvitation | null> {
    await connectToDatabase();
    try {
      const invitation = await Invitation.findById(id).lean();
      if (invitation) {
        // Transform _id to id for frontend compatibility
        (invitation as any).id = (invitation as any)._id;
      }
      return invitation as IInvitation;
    } catch (error) {
      console.error('Error finding invitation by ID:', error);
      return null;
    }
  }

  static async findByEmail(email: string): Promise<IInvitation | null> {
    await connectToDatabase();
    try {
      const invitation = await Invitation.findOne({ email }).lean();
      if (invitation) {
        // Transform _id to id for frontend compatibility
        (invitation as any).id = (invitation as any)._id;
      }
      return invitation as IInvitation;
    } catch (error) {
      console.error('Error finding invitation by email:', error);
      return null;
    }
  }

  static async create(invitationData: Omit<IInvitation, '_id'>): Promise<IInvitation> {
    await connectToDatabase();
    try {
      const invitation = new Invitation(invitationData);
      const savedInvitation = await invitation.save();
      // Transform _id to id for frontend compatibility
      const result = savedInvitation.toObject();
      (result as any).id = (result as any)._id;
      return result as IInvitation;
    } catch (error) {
      console.error('Error creating invitation:', error);
      throw error;
    }
  }

  static async update(id: string, invitationData: Partial<IInvitation>): Promise<IInvitation | null> {
    await connectToDatabase();
    try {
      const updatedInvitation = await Invitation.findByIdAndUpdate(
        id,
        { ...invitationData, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updatedInvitation) {
        // Transform _id to id for frontend compatibility
        (updatedInvitation as any).id = (updatedInvitation as any)._id;
      }
      return updatedInvitation as IInvitation;
    } catch (error) {
      console.error('Error updating invitation:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Invitation.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting invitation:', error);
      return false;
    }
  }

  static async deleteByEmail(email: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Invitation.findOneAndDelete({ email });
      return !!result;
    } catch (error) {
      console.error('Error deleting invitation by email:', error);
      return false;
    }
  }
}