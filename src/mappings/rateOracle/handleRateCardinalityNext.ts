/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { log } from '@graphprotocol/graph-ts';
import { RateCardinalityNext } from '../../../generated/templates/BaseRateOracle/BaseRateOracle';
import { RateOracle } from '../../../generated/schema';

function handleRateCardinalityNext<T>(event: T): void {
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

export default handleRateCardinalityNext;
