import { BigInt, log } from '@graphprotocol/graph-ts';

import { IrsInstance } from '../../../generated/Factory/Factory';
import { UnderlyingToken, MarginEngine, FCM } from '../../../generated/schema';
import {
  MarginEngine as MarginEngineTemplate,
  VAMM as VAMMTemplate,
  aaveFCM as AaveFCMTemplate,
  compoundFCM as CompoundFCMTemplate,
} from '../../../generated/templates';

import { getUnderlyingTokenName, getOrCreateAMM, createRateOracle } from '../../utilities';

function handleIrsInstanceDeployed(event: IrsInstance): void {
  const underlyingTokenAddress = event.params.underlyingToken.toHexString();
  const underlyingToken = new UnderlyingToken(underlyingTokenAddress);
  underlyingToken.name = getUnderlyingTokenName(underlyingTokenAddress);
  underlyingToken.decimals = BigInt.fromI32(event.params.underlyingTokenDecimals);
  underlyingToken.save();

  const rateOracle = createRateOracle(
    event.params.rateOracle.toHexString(),
    BigInt.fromI32(event.params.yieldBearingProtocolID),
    underlyingToken.id,
  );

  const amm = getOrCreateAMM(event.params.vamm.toHexString(), event.block.timestamp);

  const marginEngine = new MarginEngine(event.params.marginEngine.toHexString());

  marginEngine.amm = amm.id;
  marginEngine.save();

  const fcm = new FCM(event.params.fcm.toHexString());

  fcm.amm = amm.id;
  fcm.save();

  MarginEngineTemplate.create(event.params.marginEngine);
  VAMMTemplate.create(event.params.vamm);
  switch (event.params.yieldBearingProtocolID) {
    case 1: {
      AaveFCMTemplate.create(event.params.fcm);
      break;
    }

    case 2: {
      CompoundFCMTemplate.create(event.params.fcm);
      break;
    }

    case 3: {
      // currently no FCM for Lido
      break;
    }

    case 4: {
      // currently no FCM for Rocket
      break;
    }

    default: {
      log.info('Unrecognised Yield Bearing Protocol ID: {}', [event.params.yieldBearingProtocolID.toString()]);
      break;
    }
  }

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
