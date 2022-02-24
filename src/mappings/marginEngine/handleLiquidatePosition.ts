import { BigInt } from '@graphprotocol/graph-ts';

import { LiquidatePosition } from '../../../generated/templates/MarginEngine/MarginEngine';
import { getOrCreateAMM, getOrCreatePosition, getOrCreateTick } from '../../utilities';

function handleLiquidatePosition(event: LiquidatePosition): void {
  const owner = event.params.owner.toHexString();
  const vammAddress = event.address.toHexString();
  const amm = getOrCreateAMM(vammAddress, event.block.timestamp);

  const tickLower = getOrCreateTick(amm, BigInt.fromI32(event.params.tickLower));
  const tickUpper = getOrCreateTick(amm, BigInt.fromI32(event.params.tickUpper));
  const position = getOrCreatePosition(owner, tickLower, tickUpper, event.block.timestamp);

  position.updatedTimestamp = event.block.timestamp;
  position.amm = amm.id;
  position.owner = event.params.owner.toHexString();
  position.tickLower = tickLower.id;
  position.tickUpper = tickUpper.id;
  position.margin = event.params.margin;
  position.liquidity = event.params.liquidity;
  position.fixedTokenBalance = event.params.fixedTokenBalance;
  position.variableTokenBalance = event.params.variableTokenBalance;
  position.save();
}

export default handleLiquidatePosition;
