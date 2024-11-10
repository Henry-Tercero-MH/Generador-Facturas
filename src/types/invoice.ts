export interface Invoice {
  id?: string;
  number: string;
  amount: number;
  receivedFrom: string;
  amountInWords: string;
  concept: string;
  location: string;
  date: string;
  receivedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}