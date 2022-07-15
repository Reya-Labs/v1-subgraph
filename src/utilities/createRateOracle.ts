import { BigInt } from '@graphprotocol/graph-ts';

import { RateOracle } from '../../generated/schema';
import { ZERO_BI } from '../constants';

const createRateOracle = (
  rateOracleID: string,
  protocolId: BigInt,
  tokenId: string,
  minSecondsSinceLastUpdate: BigInt = ZERO_BI,
  rateCardinalityNext: u32 = 0,
  rateOracleUpdateCount: BigInt = ZERO_BI,
): RateOracle => {
  const rateOracle = new RateOracle(rateOracleID);
  rateOracle.protocolId = protocolId;
  rateOracle.token = tokenId;
  rateOracle.minSecondsSinceLastUpdate = minSecondsSinceLastUpdate;
  rateOracle.rateCardinalityNext = rateCardinalityNext;
  rateOracle.rateOracleUpdateCount = rateOracleUpdateCount;
  rateOracle.save();

  return rateOracle;
};

export default createRateOracle;
