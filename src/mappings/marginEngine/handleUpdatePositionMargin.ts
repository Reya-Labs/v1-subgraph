import { log, BigInt } from '@graphprotocol/graph-ts';

import { PositionMarginUpdate } from '../../../generated/templates/MarginEngine/MarginEngine';
import { ONE_BI } from '../../constants';
import { MarginUpdate } from '../../../generated/schema';
import {
  getAMMFromMarginEngineAddress,
  getOrCreatePosition,
  getOrCreateTransaction,
} from '../../utilities';

function handleUpdatePositionMargin(event: PositionMarginUpdate): void {
  const transaction = getOrCreateTransaction(event);

  const sender = event.params.sender.toHexString();
  const owner = event.params.owner.toHexString();
  const marginEngineAddress = event.address.toHexString();
  const amm = getAMMFromMarginEngineAddress(marginEngineAddress);

  log.info('marginEngineAddress: {}', [marginEngineAddress]);

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

  const marginUpdateId = `${transaction.id}#${amm.txCount.toString()}`;
  const marginUpdate = new MarginUpdate(marginUpdateId);

  marginUpdate.transaction = transaction.id;
  marginUpdate.amm = amm.id;
  marginUpdate.position = position.id;
  marginUpdate.depositer = sender;
  marginUpdate.marginDelta = event.params.marginDelta;
  marginUpdate.save();

  amm.txCount = amm.txCount.plus(ONE_BI);
  amm.save();
}

export default handleUpdatePositionMargin;
