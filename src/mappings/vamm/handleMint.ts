import { BigInt } from '@graphprotocol/graph-ts';

import { Mint as MintEvent } from '../../../generated/templates/VAMM/VAMM';
import { Mint } from '../../../generated/schema';
import { LIQUIDITY_PROVIDER, ONE_BI } from '../../constants';
import { getOrCreateAMM, getOrCreatePosition, getOrCreateTransaction } from '../../utilities';

function handleMint(event: MintEvent): void {
  const sender = event.params.sender.toHexString();
  const owner = event.params.owner.toHexString();
  const transaction = getOrCreateTransaction(event);

  const vammAddress = event.address.toHexString();
  const amm = getOrCreateAMM(vammAddress, event.block.timestamp);

  const position = getOrCreatePosition(
    amm,
    owner,
    BigInt.fromI32(event.params.tickLower),
    BigInt.fromI32(event.params.tickUpper),
    event.block.timestamp,
  );

  const mintId = `${transaction.id}#${amm.txCount.toString()}`;
  const mint = new Mint(mintId);

  mint.transaction = transaction.id;
  mint.amm = amm.id;
  mint.position = position.id;
  mint.sender = sender;
  mint.amount = event.params.amount;
  mint.save();

  position.positionType = LIQUIDITY_PROVIDER;
  position.save();

  amm.txCount = amm.txCount.plus(ONE_BI);
  amm.save();
}

export default handleMint;
