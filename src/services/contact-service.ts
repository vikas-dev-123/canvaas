import { connectToDatabase } from '../lib/db';
import { Contact, IContact } from '../models/Contact';

export class ContactService {
  static async findById(id: string): Promise<IContact | null> {
    await connectToDatabase();
    try {
      const contact = await Contact.findById(id).lean();
      if (contact) {
        // Transform _id to id for frontend compatibility
        (contact as any).id = (contact as any)._id;
      }
      return contact as IContact;
    } catch (error) {
      console.error('Error finding contact by ID:', error);
      return null;
    }
  }

  static async findBySubAccountId(subAccountId: string): Promise<IContact[]> {
    await connectToDatabase();
    try {
      const contacts = await Contact.find({ subAccountId }).lean();
      // Transform _id to id for all contacts for frontend compatibility
      const result = contacts.map(contact => {
        (contact as any).id = (contact as any)._id;
        return contact as IContact;
      });
      return result;
    } catch (error) {
      console.error('Error finding contacts by subaccount ID:', error);
      return [];
    }
  }

  static async searchByName(searchTerms: string): Promise<IContact[]> {
    await connectToDatabase();
    try {
      const contacts = await Contact.find({ 
        name: { $regex: searchTerms, $options: 'i' } 
      }).lean();
      // Transform _id to id for all contacts for frontend compatibility
      const result = contacts.map(contact => {
        (contact as any).id = (contact as any)._id;
        return contact as IContact;
      });
      return result;
    } catch (error) {
      console.error('Error searching contacts by name:', error);
      return [];
    }
  }

  static async create(contactData: Omit<IContact, '_id'>): Promise<IContact> {
    await connectToDatabase();
    try {
      const contact = new Contact(contactData);
      const savedContact = await contact.save();
      // Transform _id to id for frontend compatibility
      const result = savedContact.toObject();
      (result as any).id = (result as any)._id;
      return result as IContact;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  static async update(id: string, contactData: Partial<IContact>): Promise<IContact | null> {
    await connectToDatabase();
    try {
      const updatedContact = await Contact.findByIdAndUpdate(
        id,
        { ...contactData, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (updatedContact) {
        // Transform _id to id for frontend compatibility
        (updatedContact as any).id = (updatedContact as any)._id;
      }
      return updatedContact as IContact;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    try {
      const result = await Contact.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting contact:', error);
      return false;
    }
  }
}