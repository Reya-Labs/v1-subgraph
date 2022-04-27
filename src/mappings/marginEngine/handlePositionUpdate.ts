import { BigInt, log } from '@graphprotocol/graph-ts';

import { PositionUpdate } from '../../../generated/templates/MarginEngine/MarginEngine';
import { FIXED_TAKER, LIQUIDITY_PROVIDER, VARIABLE_TAKER } from '../../constants';
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
    log.info('Event (PositionUpdate: {}) cannot be linked to a pool', [
      event.transaction.hash.toHexString(),
    ]);
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

  if (position.positionType.notEqual(LIQUIDITY_PROVIDER)) {
    // if it's not already liquidity provider

    if (position.fixedTokenBalance.lt(BigInt.zero())) {
      position.positionType = VARIABLE_TAKER;
    } else if (position.fixedTokenBalance.gt(BigInt.zero())) {
      position.positionType = FIXED_TAKER;
    }
  }
  position.save();

  createPositionSnapshot(position, event.block.timestamp);
}

export default handlePositionUpdate;
