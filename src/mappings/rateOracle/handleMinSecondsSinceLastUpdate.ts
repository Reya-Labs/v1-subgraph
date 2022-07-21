/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { log } from '@graphprotocol/graph-ts';
import { MinSecondsSinceLastUpdate } from '../../../generated/templates/BaseRateOracle/BaseRateOracle';
import { RateOracle } from '../../../generated/schema';

function handleMinSecondsSinceLastUpdate(event: MinSecondsSinceLastUpdate): void {
  const rateOracle = RateOracle.load(event.address.toHexString());
  if (rateOracle == null) {
    log.info('Event (MinSecondsSinceLastUpdate: {}) cannot be linked to a RateOracle', [
      event.transaction.hash.toHexString(),
    ]);
    return;
  }

  // eslint-disable-next-line no-underscore-dangle
  rateOracle.minSecondsSinceLastUpdate = event.params._minSecondsSinceLastUpdate;
  rateOracle.save();
}

export default handleMinSecondsSinceLastUpdate;
