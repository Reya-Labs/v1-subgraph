/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { log } from '@graphprotocol/graph-ts';
import { OracleBufferUpdate as aaveDAIOracleBufferUpdate } from '../../../generated/templates/AaveRateOracle_DAI/AaveRateOracle_DAI';
import { OracleBufferUpdate as aaveUSDCOracleBufferUpdate } from '../../../generated/templates/AaveRateOracle_USDC/AaveRateOracle_USDC';
import { OracleBufferUpdate as compoundDAIOracleBufferUpdate } from '../../../generated/templates/CompoundRateOracle_cDAI/CompoundRateOracle_cDAI';
import { OracleBufferUpdate as lidoOracleBufferUpdate } from '../../../generated/templates/LidoRateOracle/LidoRateOracle';
import { OracleBufferUpdate as rocketOracleBufferUpdate } from '../../../generated/templates/RocketPoolRateOracle/RocketPoolRateOracle';
import { RateOracle, RateOracleUpdate } from '../../../generated/schema';
import { ONE_BI } from '../../constants';

function handleOracleBufferUpdate<T>(event: T): void {
  if (
    event instanceof aaveDAIOracleBufferUpdate ||
    event instanceof aaveUSDCOracleBufferUpdate ||
    event instanceof compoundDAIOracleBufferUpdate ||
    event instanceof lidoOracleBufferUpdate ||
    event instanceof rocketOracleBufferUpdate
  ) {
    const rateOracle = RateOracle.load(event.address.toHexString());
    if (rateOracle == null) {
      log.info('Event (OracleBufferUpdate: {}) cannot be linked to a RateOracle', [
        event.transaction.hash.toHexString(),
      ]);
      return;
    }

    const rateOracleUpdateID = `${event.address.toHexString()}#${rateOracle.rateOracleUpdateCount.toString()}`;
    const rateOracleUpdate = new RateOracleUpdate(rateOracleUpdateID);
    rateOracleUpdate.rateOracle = rateOracle.id;
    rateOracleUpdate.updateTimestamp = event.params.blockTimestampScaled;
    rateOracleUpdate.observationIndex = event.params.index;
    rateOracleUpdate.blockTimestamp = event.params.blockTimestamp;
    rateOracleUpdate.resultRay = event.params.observedValue;
    rateOracleUpdate.cardinality = event.params.cardinality;
    rateOracleUpdate.cardinalityNext = event.params.cardinalityNext;
    rateOracleUpdate.save();

    rateOracle.rateOracleUpdateCount.plus(ONE_BI);
    rateOracle.save();
  }
}

export default handleOracleBufferUpdate;
