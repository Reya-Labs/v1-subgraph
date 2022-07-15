/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { log } from '@graphprotocol/graph-ts';
import { RateCardinalityNext as aaveDAIRateCardinalityNext } from '../../../generated/templates/AaveRateOracle_DAI/AaveRateOracle_DAI';
import { RateCardinalityNext as aaveUSDCRateCardinalityNext } from '../../../generated/templates/AaveRateOracle_USDC/AaveRateOracle_USDC';
import { RateCardinalityNext as compoundDAIRateCardinalityNext } from '../../../generated/templates/CompoundRateOracle_cDAI/CompoundRateOracle_cDAI';
import { RateCardinalityNext as lidoRateCardinalityNext } from '../../../generated/templates/LidoRateOracle/LidoRateOracle';
import { RateCardinalityNext as rocketRateCardinalityNext } from '../../../generated/templates/RocketPoolRateOracle/RocketPoolRateOracle';
import { RateOracle } from '../../../generated/schema';

function handleRateCardinalityNext<T>(event: T): void {
  if (
    event instanceof aaveDAIRateCardinalityNext ||
    event instanceof aaveUSDCRateCardinalityNext ||
    event instanceof compoundDAIRateCardinalityNext ||
    event instanceof lidoRateCardinalityNext ||
    event instanceof rocketRateCardinalityNext
  ) {
    const rateOracle = RateOracle.load(event.address.toHexString());
    if (rateOracle == null) {
      log.info('Event (RateCardinalityNext: {}) cannot be linked to a RateOracle', [
        event.transaction.hash.toHexString(),
      ]);
      return;
    }

    rateOracle.rateCardinalityNext = event.params.observationCardinalityNextNew;
    rateOracle.save();
  }
}

export default handleRateCardinalityNext;
