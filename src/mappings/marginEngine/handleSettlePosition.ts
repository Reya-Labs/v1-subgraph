import { BigInt } from '@graphprotocol/graph-ts';

import { SettlePosition } from '../../../generated/templates/MarginEngine/MarginEngine';
import {
  getAMMFromMarginEngineAddress,
  getOrCreatePosition,
  getOrCreateTick,
} from '../../utilities';

function handleSettlePosition(event: SettlePosition): void {
  const owner = event.params.owner.toHexString();
  const marginEngineAddress = event.address.toHexString();
  const amm = getAMMFromMarginEngineAddress(marginEngineAddress);

  if (amm === null) {
    return;
  }

  const tickLower = getOrCreateTick(amm, BigInt.fromI32(event.params.tickLower));
  const tickUpper = getOrCreateTick(amm, BigInt.fromI32(event.params.tickUpper));
  const position = getOrCreatePosition(owner, tickLower, tickUpper, event.block.timestamp);

  position.updatedTimestamp = event.block.timestamp;
  position.amm = amm.id;
  position.owner = owner;
  position.tickLower = tickLower.id;
  position.tickUpper = tickUpper.id;
  position.margin = event.params.margin;
  position.isSettled = event.params.isSettled;
  position.fixedTokenBalance = event.params.fixedTokenBalance;
  position.variableTokenBalance = event.params.variableTokenBalance;
  position.save();
}

export default handleSettlePosition;
