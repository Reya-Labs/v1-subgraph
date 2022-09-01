import { BigInt } from '@graphprotocol/graph-ts';

import { RateOracle } from '../../generated/schema';

const createRateOracle = (
  rateOracleAddress: string,
  protocolId: BigInt,
  token: string,
  amm: string,
  rateOracleIndexInAMM: BigInt,
): RateOracle => {
  const rateOracle = new RateOracle(rateOracleAddress);

  rateOracle.protocolId = protocolId;
  rateOracle.token = token;
  rateOracle.minSecondsSinceLastUpdate = BigInt.fromI32(0);
  rateOracle.rateCardinalityNext = 0;
  rateOracle.rateOracleUpdateCount = BigInt.fromI32(0);
  rateOracle.amm = amm;
  rateOracle.rateOracleIndexInAMM = rateOracleIndexInAMM;
  rateOracle.save();

  return rateOracle;
};

export default createRateOracle;
