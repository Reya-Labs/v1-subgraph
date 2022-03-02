import { Wallet } from '../../generated/schema';
import { ZERO_BI } from '../constants';

const getOrCreateWallet = (address: string): Wallet => {
  const existingWallet = Wallet.load(address);

  if (existingWallet !== null) {
    return existingWallet;
  }

  const wallet = new Wallet(address);

  wallet.positionCount = ZERO_BI;
  wallet.save();

  return wallet;
};

export default getOrCreateWallet;
