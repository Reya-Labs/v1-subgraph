import { BigInt } from '@graphprotocol/graph-ts';

import { VAMMInitialization } from '../../../generated/templates/VAMM/VAMM';
import { getOrCreateAMM } from '../../utilities';

function handleInitializeVAMM(event: VAMMInitialization): void {
  const vammAddress = event.address.toHexString();
  const amm = getOrCreateAMM(vammAddress, event.block.timestamp);

  amm.tick = BigInt.fromI32(event.params.tick);
  amm.save();
}

export default handleInitializeVAMM;
