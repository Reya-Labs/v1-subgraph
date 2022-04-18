import { BigInt } from '@graphprotocol/graph-ts';

import { Liquidation } from '../../../generated/schema';
import { PositionLiquidation } from '../../../generated/templates/MarginEngine/MarginEngine';
import { ONE_BI } from '../../constants';
import {
  getAMMFromMarginEngineAddress,
  getOrCreatePosition,
  getOrCreateTransaction,
} from '../../utilities';

function handleLiquidatePosition(event: PositionLiquidation): void {
  const transaction = getOrCreateTransaction(event);

  const owner = event.params.owner.toHexString();
  const liquidator = event.params.liquidator.toHexString();

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

  const liquidationId = `${transaction.id}#${amm.txCount.toString()}`;
  const liquidation = new Liquidation(liquidationId);

  liquidation.transaction = transaction.id;
  liquidation.amm = amm.id;
  liquidation.position = position.id;
  liquidation.liquidator = liquidator;
  liquidation.reward = event.params.liquidatorReward;
  liquidation.notionalUnwound = event.params.notionalUnwound;
  liquidation.save();

  amm.txCount = amm.txCount.plus(ONE_BI);
  amm.save();
}

export default handleLiquidatePosition;
