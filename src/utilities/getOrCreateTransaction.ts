const getOrCreateTransaction = (transactionHash: string): Transaction => {
  const transaction = Transaction.load(transactionHash)

  if (transaction !== null) {
    return transaction;
  }

  return return new Transaction(transactionHash);
};

export default getOrCreateTransaction;
