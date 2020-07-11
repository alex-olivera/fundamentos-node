import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

const OUTCOME_VALUE = 'outcome';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (!['income', 'outcome'].includes(type)) {
      throw Error('Transaction type is invalid.');
    }

    if (type === OUTCOME_VALUE) {
      const { total } = this.transactionsRepository.getBalance();

      if (total < value) {
        throw Error('Insufficient balance.');
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
