import { BigInt } from '@graphprotocol/graph-ts';

import { InitializeVAMM } from '../../../generated/templates/VAMM/VAMM';
import { ZERO_BI } from '../../constants';
import { getOrCreateAMM } from '../../utilities';

function handleInitializeVAMM(event: InitializeVAMM): void {
  const vammAddress = event.address.toHexString();
  const amm = getOrCreateAMM(vammAddress, event.block.timestamp);

  amm.sqrtPriceX96 = event.params.sqrtPriceX96;
  amm.liquidity = ZERO_BI;
  amm.tick = BigInt.fromI32(event.params.tick);
  amm.save();
}

export default handleInitializeVAMM;
