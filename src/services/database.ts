import { Invoice } from '../types/invoice';

// This interface defines the database operations
export interface DatabaseService {
  saveInvoice(invoice: Invoice): Promise<void>;
  getInvoices(): Promise<Invoice[]>;
  getInvoiceById(id: string): Promise<Invoice | null>;
  authenticate(username: string, password: string): Promise<boolean>;
}

// MySQL implementation (to be implemented)
export class MySQLDatabase implements DatabaseService {
  async saveInvoice(invoice: Invoice): Promise<void> {
    // TODO: Implement MySQL connection and query
    console.log('Saving invoice to MySQL:', invoice);
  }

  async getInvoices(): Promise<Invoice[]> {
    // TODO: Implement MySQL connection and query
    return [];
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    // TODO: Implement MySQL connection and query
    return null;
  }

  async authenticate(username: string, password: string): Promise<boolean> {
    // TODO: Implement MySQL authentication
    return username === 'admin' && password === 'admin';
  }
}

// Export a singleton instance
export const db = new MySQLDatabase();