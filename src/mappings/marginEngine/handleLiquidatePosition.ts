import { BigInt, log } from '@graphprotocol/graph-ts';

import { Liquidation, RateOracle } from '../../../generated/schema';
import { PositionLiquidation } from '../../../generated/templates/MarginEngine/MarginEngine';
import { ONE_BI } from '../../constants';
import {
  convertUnixToDate,
  getAMMFromMarginEngineAddress,
  getOrCreatePosition,
  getOrCreateTransaction,
  getProtocolPrefix,
  getUnderlyingTokenName,
  sendPushNotification,
} from '../../utilities';

function handleLiquidatePosition(event: PositionLiquidation): void {
  const transaction = getOrCreateTransaction(event);

  const owner = event.params.owner.toHexString();
  const liquidator = event.params.liquidator.toHexString();

  const marginEngineAddress = event.address.toHexString();
  const amm = getAMMFromMarginEngineAddress(marginEngineAddress);

  if (amm === null) {
    log.info('Event (PositionLiquidation: {}) cannot be linked to a pool', [
      event.transaction.hash.toHexString(),
    ]);
    return;
  }

  const position = getOrCreatePosition(
    amm,
    owner,
    BigInt.fromI32(event.params.tickLower),
    BigInt.fromI32(event.params.tickUpper),
    event.block.timestamp,
  );

  const liquidationId = `${transaction.id}#${amm.txCount.toString()}`;
  const liquidation = new Liquidation(liquidationId);

  liquidation.transaction = transaction.id;
  liquidation.amm = amm.id;
  liquidation.position = position.id;
  liquidation.liquidator = liquidator;
  liquidation.reward = event.params.liquidatorReward;
  liquidation.notionalUnwound = event.params.notionalUnwound;
  liquidation.save();

  amm.txCount = amm.txCount.plus(ONE_BI);
  amm.save();

  // Need to get the underlying token of the liquidated pool on line 64-65
  const rateOracle = RateOracle.load(amm.rateOracle);

  if (rateOracle === null) {
    return;
  }

  const recipient = `${owner}`;
  const type = '3'; // only send it to a specific person
  const title = 'Liquidation Event Alert';
  const body = `Please check your portfolio as one of your positions was liquidated`;
  const subject = `Liquidation Event Alert for ${owner}`;
  const message = `The address ${owner} has been liquidated. \n
  Liquidation took place in the pool: ${getProtocolPrefix(
    rateOracle.protocolId,
  )}-${getUnderlyingTokenName(rateOracle.token)} \n
  Pool matures on: ${convertUnixToDate(amm.termEndTimestamp)} \n
  Amount of notional unwound was: ${liquidation.notionalUnwound.toString()} \n
  The lower tick of the position was: ${position.tickLower.toString()} \n
  The upper tick of the position was: ${position.tickUpper.toString()} \n
  The margin remaining in the position is: ${position.margin}
  `;
  const image = '';
  const secret = 'null';
  const cta = 'https://app.voltz.xyz';

  sendPushNotification(recipient, type, title, body, subject, message, image, secret, cta);
}
export default handleLiquidatePosition;
