import { connectToDatabase } from '../lib/db';
import { Contact, IContact } from '../models/Contact';

export class ContactService {
  static async findById(id: string): Promise<IContact | null> {
    await connectToDatabase();
    try {
      const contact = await Contact.findById(id).lean();
      if (contact) {
        // Clean up the contact object for Next.js compatibility
        const { _id, __v, ...cleanContact } = contact;
        cleanContact.id = cleanContact.id ?? _id?.toString();
        return cleanContact as IContact;
      }
      return null;
    } catch (error) {
      console.error('Error finding contact by ID:', error);
      return null;
    }
  }

  static async findBySubAccountId(subAccountId: string): Promise<IContact[]> {
    await connectToDatabase();
    try {
      const contacts = await Contact.find({ subAccountId }).lean();
      // Clean up the contact objects for Next.js compatibility
      const result = contacts.map(contact => {
        const { _id, __v, ...cleanContact } = contact;
        cleanContact.id = cleanContact.id ?? _id?.toString();
        return cleanContact as IContact;
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
      // Clean up the contact objects for Next.js compatibility
      const result = contacts.map(contact => {
        const { _id, __v, ...cleanContact } = contact;
        cleanContact.id = cleanContact.id ?? _id?.toString();
        return cleanContact as IContact;
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
      // Clean up the contact object for Next.js compatibility
      const contactObj = savedContact.toObject();
      const { _id, __v, ...cleanResult } = contactObj;
      cleanResult.id = cleanResult.id ?? _id?.toString();
      return cleanResult as IContact;
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
        // Clean up the contact object for Next.js compatibility
        const { _id, __v, ...cleanUpdatedContact } = updatedContact;
        cleanUpdatedContact.id = cleanUpdatedContact.id ?? _id?.toString();
        return cleanUpdatedContact as IContact;
      }
      return null;
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