import { BigInt } from '@graphprotocol/graph-ts';

import { VAMMPriceChange } from '../../../generated/templates/VAMM/VAMM';
import getOrCreateAMM from '../../utilities/getOrCreateAMM';

function handleVAMMPriceChange(event: VAMMPriceChange): void {
  const vammAddress = event.address.toHexString();
  const amm = getOrCreateAMM(vammAddress, event.block.timestamp);

  amm.tick = BigInt.fromI32(event.params.tick);
  amm.save();
}

export default handleVAMMPriceChange;
