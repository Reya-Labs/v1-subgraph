import { BigInt } from '@graphprotocol/graph-ts';

import { UpdatePositionPostMintBurn } from '../../../generated/templates/MarginEngine/MarginEngine';
import { ZERO_BI } from '../../constants';
import { getOrCreateAMM, getOrCreatePosition, getOrCreateTick } from '../../utilities';

function handleUpdatePositionPostMintBurn(event: UpdatePositionPostMintBurn): void {
  const { owner, tickLower: tickLowerI32, tickUpper: tickUpperI32, liquidity } = event.params;

  const vammAddress = event.address.toHexString();
  const amm = getOrCreateAMM({ vammAddress, timestamp: event.block.timestamp });

  const tickLower = getOrCreateTick({ amm, value: BigInt.fromI32(tickLowerI32) });
  const tickUpper = getOrCreateTick({ amm, value: BigInt.fromI32(tickUpperI32) });
  const position = getOrCreatePosition({
    address: owner.toHexString(),
    tickLower,
    tickUpper,
    timestamp: event.block.timestamp,
  });

  position.updatedTimestamp = event.block.timestamp;
  position.amm = amm.id;
  position.owner = owner.toHexString();
  position.tickLower = tickLower.id;
  position.tickUpper = tickUpper.id;
  position.liquidity = liquidity;
  position.margin = ZERO_BI;
  position.isLiquidityProvider = true;
  position.isSettled = false;

  if (liquidity.lt(ZERO_BI) || liquidity.equals(ZERO_BI)) {
    position.closedTimestamp = event.block.timestamp;
  }

  position.save();
}

export default handleUpdatePositionPostMintBurn;
