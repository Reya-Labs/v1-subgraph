import { BigInt } from '@graphprotocol/graph-ts';

import { VAMMInitialization } from '../../../generated/templates/VAMM/VAMM';
import { VAMMPriceChange } from '../../../generated/schema';
import { ONE_BI } from '../../constants';
import { getOrCreateAMM } from '../../utilities';

function handleInitializeVAMM(event: VAMMInitialization): void {
  const vammAddress = event.address.toHexString();
  const amm = getOrCreateAMM(vammAddress, event.block.timestamp);

  amm.tick = BigInt.fromI32(event.params.tick);
  // Increment the vammPriceChangeCount every time this handler is called
  amm.vammPriceChangeCount = amm.vammPriceChangeCount.plus(ONE_BI);
  amm.save();

  const vammPriceChange = new VAMMPriceChange(`${amm.id}#${amm.vammPriceChangeCount}`);
  vammPriceChange.amm = amm.id;
  vammPriceChange.timestamp = event.block.timestamp;
  vammPriceChange.tick = BigInt.fromI32(event.params.tick);
  vammPriceChange.save();
}

export default handleInitializeVAMM;
