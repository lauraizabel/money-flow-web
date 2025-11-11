export class UpdateTransactionDto {
  type?: string;
  amount?: number;
  description?: string;
  date?: string;
  categoryId?: string;
  tags?: string[];

  constructor(data: object = {}) {
    Object.assign(this, data);
  }
}
