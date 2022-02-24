import { BigInt } from '@graphprotocol/graph-ts';

import { Mint as MintEvent } from '../../../generated/templates/VAMM/VAMM';
import { Mint } from '../../../generated/schema';
import { ONE_BI } from '../../constants';
import {
  getOrCreateAMM,
  getOrCreatePosition,
  getOrCreateTick,
  getOrCreateTransaction,
} from '../../utilities';

function handleMint(event: MintEvent): void {
  const sender = event.params.sender.toHexString();
  const owner = event.params.owner.toHexString();
  const transaction = getOrCreateTransaction(event);

  const vammAddress = event.address.toHexString();
  const amm = getOrCreateAMM(vammAddress, event.block.timestamp);

  const tickLower = getOrCreateTick(amm, BigInt.fromI32(event.params.tickLower));
  const tickUpper = getOrCreateTick(amm, BigInt.fromI32(event.params.tickUpper));
  const position = getOrCreatePosition(owner, tickLower, tickUpper, event.block.timestamp);

  const mintId = `${transaction.id}#${amm.txCount.toString()}`;
  const mint = new Mint(mintId);

  mint.transaction = transaction.id;
  mint.amm = amm.id;
  mint.position = position.id;
  mint.sender = sender;
  mint.tickLower = tickLower.id;
  mint.tickUpper = tickUpper.id;
  mint.amount = event.params.amount;
  mint.save();

  amm.txCount = amm.txCount.plus(ONE_BI);
  amm.save();
}

export default handleMint;
