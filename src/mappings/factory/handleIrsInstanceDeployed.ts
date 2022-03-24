import { BigInt, log } from '@graphprotocol/graph-ts';

import { IrsInstance } from '../../../generated/Factory/Factory';
import { UnderlyingToken, RateOracle, MarginEngine } from '../../../generated/schema';
import {
  MarginEngine as MarginEngineTemplate,
  VAMM as VAMMTemplate,
} from '../../../generated/templates';
import { getUnderlyingTokenName, getOrCreateAMM } from '../../utilities';

function handleIrsInstanceDeployed(event: IrsInstance): void {
  const underlyingTokenAddress = event.params.underlyingToken.toHexString();
  const underlyingToken = new UnderlyingToken(underlyingTokenAddress);

  underlyingToken.name = getUnderlyingTokenName(underlyingTokenAddress);
  underlyingToken.save();

  const rateOracle = new RateOracle(event.params.rateOracle.toHexString());

  rateOracle.token = underlyingToken.id;
  rateOracle.protocolId = BigInt.fromI32(event.params.yieldBearingProtocolID);
  rateOracle.save();

  const amm = getOrCreateAMM(event.params.vamm.toHexString(), event.block.timestamp);

  const marginEngine = new MarginEngine(event.params.marginEngine.toHexString());

  marginEngine.amm = amm.id;
  marginEngine.save();

  MarginEngineTemplate.create(event.params.marginEngine);
  VAMMTemplate.create(event.params.vamm);

  log.info('Initializing new MarginEngine: {}, VAMM: {}', [
    event.params.vamm.toHexString(),
    event.params.marginEngine.toHexString(),
  ]);

  amm.updatedTimestamp = event.block.timestamp;
  amm.fcmAddress = event.params.fcm.toHexString();
  amm.marginEngineAddress = marginEngine.id;
  amm.rateOracle = rateOracle.id;
  amm.termStartTimestamp = event.params.termStartTimestampWad;
  amm.termEndTimestamp = event.params.termEndTimestampWad;
  amm.tickSpacing = BigInt.fromI32(event.params.tickSpacing);
  amm.save();
}

export default handleIrsInstanceDeployed;
