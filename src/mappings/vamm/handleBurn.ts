import { BigInt } from '@graphprotocol/graph-ts';

import { Burn as BurnEvent } from '../../../generated/templates/VAMM/VAMM';
import { Burn } from '../../../generated/schema';
import { ONE_BI } from '../../constants';
import { getOrCreateAMM, getOrCreatePosition, getOrCreateTransaction } from '../../utilities';

function handleBurn(event: BurnEvent): void {
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

  const burnId = `${transaction.id}#${amm.txCount.toString()}`;
  const burn = new Burn(burnId);

  burn.transaction = transaction.id;
  burn.amm = amm.id;
  burn.position = position.id;
  burn.sender = sender;
  burn.amount = event.params.amount;
  burn.save();

  amm.txCount = amm.txCount.plus(ONE_BI);
  amm.save();
}

export default handleBurn;
