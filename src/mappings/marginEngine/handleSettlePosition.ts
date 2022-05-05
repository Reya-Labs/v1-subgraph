import { BigInt, log } from '@graphprotocol/graph-ts';

import { PositionSettlement } from '../../../generated/templates/MarginEngine/MarginEngine';
import { ONE_BI } from '../../constants';
import { Settlement } from '../../../generated/schema';
import {
  getAMMFromMarginEngineAddress,
  getOrCreatePosition,
  getOrCreateTransaction,
} from '../../utilities';

function handleSettlePosition(event: PositionSettlement): void {
  const transaction = getOrCreateTransaction(event);

  const owner = event.params.owner.toHexString();
  const marginEngineAddress = event.address.toHexString();
  const amm = getAMMFromMarginEngineAddress(marginEngineAddress);

  if (amm === null) {
    log.info('Event (PositionSettlement: {}) cannot be linked to a pool', [
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

  const SettlementId = `${transaction.id}#${amm.txCount.toString()}`;
  const settlement = new Settlement(SettlementId);

  settlement.transaction = transaction.id;
  settlement.amm = amm.id;
  settlement.position = position.id;
  settlement.settlementCashflow = event.params.settlementCashflow;
  settlement.save();

  position.isSettled = true;
  position.save();

  amm.totalLiquidity = amm.totalLiquidity.minus(position.liquidity);
  amm.txCount = amm.txCount.plus(ONE_BI);
  amm.save();
}

export default handleSettlePosition;
