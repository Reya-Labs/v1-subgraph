import { BigInt, log } from '@graphprotocol/graph-ts';

import { IrsInstance } from '../../../generated/Factory/Factory';
import { UnderlyingToken, RateOracle, MarginEngine, FCM } from '../../../generated/schema';
import {
  MarginEngine as MarginEngineTemplate,
  VAMM as VAMMTemplate,
  BaseFCM as BaseFCMTemplate,
} from '../../../generated/templates';
import { ONE_BI, ZERO_BI } from '../../constants';
import {
  getUnderlyingTokenName,
  getOrCreateAMM,
  createMarginCalculatorParameters,
} from '../../utilities';

function handleIrsInstanceDeployed(event: IrsInstance): void {
  const underlyingTokenAddress = event.params.underlyingToken.toHexString();
  const underlyingToken = new UnderlyingToken(underlyingTokenAddress);
  underlyingToken.name = getUnderlyingTokenName(underlyingTokenAddress);
  underlyingToken.decimals = BigInt.fromI32(event.params.underlyingTokenDecimals);
  underlyingToken.save();

  const rateOracle = new RateOracle(event.params.rateOracle.toHexString());

  rateOracle.token = underlyingToken.id;
  rateOracle.protocolId = BigInt.fromI32(event.params.yieldBearingProtocolID);
  rateOracle.save();

  const amm = getOrCreateAMM(event.params.vamm.toHexString(), event.block.timestamp);

  const marginEngine = new MarginEngine(event.params.marginEngine.toHexString());

  marginEngine.amm = amm.id;
  marginEngine.mcpCount = ZERO_BI;
  marginEngine.marginCalculatorParameters = createMarginCalculatorParameters(
    `${marginEngine.id}#${marginEngine.mcpCount.toString()}`,
  ).id;
  marginEngine.mcpCount = marginEngine.mcpCount.plus(ONE_BI);
  marginEngine.save();

  const fcm = new FCM(event.params.fcm.toHexString());

  fcm.amm = amm.id;
  fcm.save();

  MarginEngineTemplate.create(event.params.marginEngine);
  VAMMTemplate.create(event.params.vamm);
  BaseFCMTemplate.create(event.params.fcm);

  log.info('Initializing new MarginEngine: {}, VAMM: {}, FCM: {}', [
    event.params.vamm.toHexString(),
    event.params.marginEngine.toHexString(),
    event.params.fcm.toHexString(),
  ]);

  amm.updatedTimestamp = event.block.timestamp;
  amm.fcm = fcm.id;
  amm.marginEngine = marginEngine.id;
  amm.rateOracle = rateOracle.id;
  amm.termStartTimestamp = event.params.termStartTimestampWad;
  amm.termEndTimestamp = event.params.termEndTimestampWad;
  amm.tickSpacing = BigInt.fromI32(event.params.tickSpacing);
  amm.save();
}

export default handleIrsInstanceDeployed;
