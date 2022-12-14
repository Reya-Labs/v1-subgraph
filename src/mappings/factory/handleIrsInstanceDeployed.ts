import { BigInt, log } from '@graphprotocol/graph-ts';

import { IrsInstance } from '../../../generated/Factory/Factory';
import { UnderlyingToken, RateOracle, MarginEngine, FCM } from '../../../generated/schema';
import {
  MarginEngine as MarginEngineTemplate,
  VAMM as VAMMTemplate,
  aaveFCM as AaveFCMTemplate,
} from '../../../generated/templates';
import { NOTIFICATION_CONFIGS } from '../../constants';
import {
  getUnderlyingTokenName,
  getOrCreateAMM,
  sendPushNotification,
  getProtocolPrefix,
  convertUnixToDate,
} from '../../utilities';

// reads whether a new AMM was deployed by the factory
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
  marginEngine.save();

  const fcm = new FCM(event.params.fcm.toHexString());

  fcm.amm = amm.id;
  fcm.save();

  MarginEngineTemplate.create(event.params.marginEngine);
  VAMMTemplate.create(event.params.vamm);
  AaveFCMTemplate.create(event.params.fcm);

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

  const recipient = `${NOTIFICATION_CONFIGS[1][0]}`; // goerli test channel address
  const type = '1'; // broadcast to everyone
  const title = 'New Pool Deployment on Voltz Protocol';
  const body = `A brand new pool was launched`;
  const subject = `Pool Deployment`;
  const message = `A new pool on ${getProtocolPrefix(rateOracle.protocolId)} - ${
    underlyingToken.name
  } has been launched \
  The pool starts at ${convertUnixToDate(
    amm.termStartTimestamp,
  )} and matures on ${convertUnixToDate(amm.termEndTimestamp)}`;
  const image = '';
  const secret = 'null';
  const cta = 'https://app.voltz.xyz';

  sendPushNotification(recipient, type, title, body, subject, message, image, secret, cta);
}

export default handleIrsInstanceDeployed;
