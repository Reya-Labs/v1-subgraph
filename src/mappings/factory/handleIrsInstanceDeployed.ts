import { BigInt, log } from '@graphprotocol/graph-ts';

import { IrsInstance } from '../../../generated/Factory/Factory';
import { UnderlyingToken, RateOracle, MarginEngine, FCM } from '../../../generated/schema';
import {
  MarginEngine as MarginEngineTemplate,
  VAMM as VAMMTemplate,
  aaveFCM as AaveFCMTemplate,
} from '../../../generated/templates';
import { sendEPNSNotification } from '../../EPNSNotification';
import { getUnderlyingTokenName, getOrCreateAMM } from '../../utilities';
import { getProtocolPrefix } from '../../utilities/getProtocolPrefix';

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

  const recipient = '0x45556408e543158f74403e882E3C8c23eCD9f73'; // goerli test channel address
  const type = '1'; // broadcast to everyone
  const title = 'New Pool Deployment on Voltz Protocol';
  const body = `A brand new pool was launched`;
  const subject = `Pool Deployment`;
  const message = `A new pool on ${getProtocolPrefix(Number(rateOracle.protocolId))} - ${
    underlyingToken.name
  } has been launched \
  The new pool has been deployed with address ${amm.id} \
  The pool starts at ${amm.termStartTimestamp} and matures on ${amm.termEndTimestamp}`;

  const image = '';
  const secret = 'null';
  const cta = 'https://app.voltz.xyz/';

  const notification = `{
      "type": "${type}",
      "title": "${title}",
      "body": "${body}",
      "subject": "${subject}",
      "message": "${message}",
      "image": "${image}",
      "secret": "${secret}",
      "cta": "${cta}"
  }`;

  // Any time a new event is fired by the factory to mark a new pool deployment handleIrsInstanceDeployed is fired which
  // will fire a notification to the PUSH channel with info on the new pool.
  sendEPNSNotification(recipient, notification);
}

export default handleIrsInstanceDeployed;
