/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { log } from '@graphprotocol/graph-ts';
import { OracleBufferUpdate } from '../../../generated/templates/BaseRateOracle/BaseRateOracle';
import { RateOracle, RateOracleUpdate } from '../../../generated/schema';
import { ONE_BI } from '../../constants';

function handleOracleBufferUpdate(event: OracleBufferUpdate): void {
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

export default handleOracleBufferUpdate;
