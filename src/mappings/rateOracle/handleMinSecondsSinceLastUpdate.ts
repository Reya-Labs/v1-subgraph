/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { log } from '@graphprotocol/graph-ts';
import { MinSecondsSinceLastUpdate as aaveDAIMinSecondsSinceLastUpdate } from '../../../generated/templates/AaveRateOracle_DAI/AaveRateOracle_DAI';
import { MinSecondsSinceLastUpdate as aaveUSDCMinSecondsSinceLastUpdate } from '../../../generated/templates/AaveRateOracle_USDC/AaveRateOracle_USDC';
import { MinSecondsSinceLastUpdate as compoundDAIMinSecondsSinceLastUpdate } from '../../../generated/templates/CompoundRateOracle_cDAI/CompoundRateOracle_cDAI';
import { MinSecondsSinceLastUpdate as lidoMinSecondsSinceLastUpdate } from '../../../generated/templates/LidoRateOracle/LidoRateOracle';
import { MinSecondsSinceLastUpdate as rocketMinSecondsSinceLastUpdate } from '../../../generated/templates/RocketPoolRateOracle/RocketPoolRateOracle';
import { RateOracle } from '../../../generated/schema';

function handleMinSecondsSinceLastUpdate<T>(event: T): void {
  if (
    event instanceof aaveDAIMinSecondsSinceLastUpdate ||
    event instanceof aaveUSDCMinSecondsSinceLastUpdate ||
    event instanceof compoundDAIMinSecondsSinceLastUpdate ||
    event instanceof lidoMinSecondsSinceLastUpdate ||
    event instanceof rocketMinSecondsSinceLastUpdate
  ) {
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
}

export default handleMinSecondsSinceLastUpdate;
