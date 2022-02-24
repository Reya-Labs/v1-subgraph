import { BigInt } from '@graphprotocol/graph-ts';

import { UpdatePositionPostMintBurn } from '../../../generated/templates/MarginEngine/MarginEngine';
import { ZERO_BI } from '../../constants';
import { getOrCreateAMM, getOrCreatePosition, getOrCreateTick } from '../../utilities';

function handleUpdatePositionPostMintBurn(event: UpdatePositionPostMintBurn): void {
  const owner = event.params.owner.toHexString();
  const vammAddress = event.address.toHexString();
  const amm = getOrCreateAMM(vammAddress, event.block.timestamp);

  const tickLower = getOrCreateTick(amm, BigInt.fromI32(event.params.tickLower));
  const tickUpper = getOrCreateTick(amm, BigInt.fromI32(event.params.tickUpper));
  const position = getOrCreatePosition(owner, tickLower, tickUpper, event.block.timestamp);

  position.updatedTimestamp = event.block.timestamp;
  position.amm = amm.id;
  position.owner = owner;
  position.tickLower = tickLower.id;
  position.tickUpper = tickUpper.id;
  position.liquidity = event.params.liquidity;
  position.isLiquidityProvider = true;
  position.isSettled = false;

  if (event.params.liquidity.lt(ZERO_BI) || event.params.liquidity.equals(ZERO_BI)) {
    position.closedTimestamp = event.block.timestamp;
  }

  position.save();
}

export default handleUpdatePositionPostMintBurn;
