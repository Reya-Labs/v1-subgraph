import { BigInt, BigDecimal, ethereum } from '@graphprotocol/graph-ts';

import getOrCreateTransaction from './getOrCreateTransaction';

const saveTransaction = (event: ethereum.Event): Transaction => {
  const transaction = getOrCreateTransaction(event.transaction.hash.toHexString());

  transaction.blockNumber = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.gasUsed = event.transaction.gasUsed;
  transaction.gasPrice = event.transaction.gasPrice;
  transaction.save();

  return transaction as Transaction;
};

export default saveTransaction;
