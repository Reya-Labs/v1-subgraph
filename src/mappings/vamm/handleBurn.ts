import { BigInt } from '@graphprotocol/graph-ts';

import { Burn as BurnEvent } from '../../../generated/templates/VAMM/VAMM';
import { Burn } from '../../../generated/schema';
import { ZERO_BI, ONE_BI } from '../../constants';
import {
  getOrCreateAMM,
  getOrCreatePosition,
  getOrCreateTick,
  getOrCreateTransaction,
} from '../../utilities';

function handleBurn(event: BurnEvent): void {
  const { sender, owner, tickLower: tickLowerI32, tickUpper: tickUpperI32, amount } = event.params;

  const transaction = getOrCreateTransaction(event);

  const vammAddress = event.address.toHexString();
  const amm = getOrCreateAMM(vammAddress);

  const tickLower = getOrCreateTick({ amm, value: BigInt.fromI32(tickLowerI32) });
  const tickUpper = getOrCreateTick({ amm, value: BigInt.fromI32(tickUpperI32) });
  const position = getOrCreatePosition({ address: owner.toHexString(), tickLower, tickUpper });

  const burnId = `${transaction.id}#${amm.txCount}`;
  const burn = new Burn(burnId);

  burn.transaction = transaction.id;
  burn.amm = amm.id;
  burn.position = position.id;
  burn.sender = sender.toHexString();
  burn.tickLower = tickLower.id;
  burn.tickUpper = tickUpper.id;
  burn.amount = amount;
  burn.save();

  amm.txCount = (amm.txCount || ZERO_BI).plus(ONE_BI);
  amm.save();
}

export default handleBurn;
