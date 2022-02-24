import { BigInt } from '@graphprotocol/graph-ts';

import { UpdatePositionMargin } from '../../../generated/templates/MarginEngine/MarginEngine';
import { getOrCreateAMM, getOrCreatePosition, getOrCreateTick } from '../../utilities';

function handleUpdatePositionMargin(event: UpdatePositionMargin): void {
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
  position.margin = event.params.positionMargin;
  position.save();
}

export default handleUpdatePositionMargin;
