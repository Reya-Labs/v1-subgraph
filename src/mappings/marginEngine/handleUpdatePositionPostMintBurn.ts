import { BigInt } from '@graphprotocol/graph-ts';

import { PositionPostMintBurnUpdate } from '../../../generated/templates/MarginEngine/MarginEngine';
import { ZERO_BI } from '../../constants';
import {
  createPositionSnapshot,
  getAMMFromMarginEngineAddress,
  getOrCreatePosition,
  getOrCreateTick,
} from '../../utilities';

function handleUpdatePositionPostMintBurn(event: PositionPostMintBurnUpdate): void {
  const owner = event.params.owner.toHexString();
  const marginEngineAddress = event.address.toHexString();
  const amm = getAMMFromMarginEngineAddress(marginEngineAddress);

  if (amm === null) {
    return;
  }

  const tickLower = getOrCreateTick(amm, BigInt.fromI32(event.params.tickLower));
  const tickUpper = getOrCreateTick(amm, BigInt.fromI32(event.params.tickUpper));
  const position = getOrCreatePosition(
    marginEngineAddress,
    owner,
    tickLower,
    tickUpper,
    event.block.timestamp,
  );

  position.updatedTimestamp = event.block.timestamp;
  position.amm = amm.id;
  position.owner = owner;
  position.tickLower = tickLower.id;
  position.tickUpper = tickUpper.id;
  position.liquidity = event.params.liquidity;
  position.isLiquidityProvider = true;
  position.isSettled = false;
  position.isEmpty = false;

  if (event.params.liquidity.lt(ZERO_BI) || event.params.liquidity.equals(ZERO_BI)) {
    position.isEmpty = true;
  }

  createPositionSnapshot(position, event.block.timestamp);

  position.save();
}

export default handleUpdatePositionPostMintBurn;
