import { BigInt } from '@graphprotocol/graph-ts';

import { PositionUpdate } from '../../../generated/templates/MarginEngine/MarginEngine';
import {
  createPositionSnapshot,
  getAMMFromMarginEngineAddress,
  getOrCreatePosition,
} from '../../utilities';

function handlePositionUpdate(event: PositionUpdate): void {
  const owner = event.params.owner.toHexString();

  const marginEngineAddress = event.address.toHexString();
  const amm = getAMMFromMarginEngineAddress(marginEngineAddress);

  if (amm === null) {
    return;
  }

  const position = getOrCreatePosition(
    amm,
    owner,
    BigInt.fromI32(event.params.tickLower),
    BigInt.fromI32(event.params.tickUpper),
    event.block.timestamp,
  );

  position.updatedTimestamp = event.block.timestamp;
  position.fixedTokenBalance = event.params.fixedTokenBalance;
  position.variableTokenBalance = event.params.variableTokenBalance;
  // eslint-disable-next-line no-underscore-dangle
  position.liquidity = event.params._liquidity;
  position.margin = event.params.margin;
  position.accumulatedFees = event.params.accumulatedFees;
  position.save();

  createPositionSnapshot(position, event.block.timestamp);
}

export default handlePositionUpdate;
