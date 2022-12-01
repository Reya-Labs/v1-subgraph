import { BigInt, log } from '@graphprotocol/graph-ts';

import { Liquidation, RateOracle } from '../../../generated/schema';
import { PositionLiquidation } from '../../../generated/templates/MarginEngine/MarginEngine';
import { ONE_BI } from '../../constants';
import { sendEPNSNotification } from '../../EPNSNotification';
import {
  getAMMFromMarginEngineAddress,
  getOrCreatePosition,
  getOrCreateTransaction,
  getUnderlyingTokenName,
} from '../../utilities';
import { getProtocolPrefix } from '../../utilities/getProtocolPrefix';

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
  const recipient = owner; // somehow get the address of the liquidated person here
  const type = '3'; // only send it to a specific person
  const title = 'Liquidation Event Alert';
  const body = `The address ${owner} has been liquidated. \n
  The amount of notional unwound was ${liquidation.notionalUnwound}. \n
  The lower tick and upper tick were ${position.tickLower} and ${
    position.tickUpper
  }, respectively. \n
  The liquidation happened in the pool ${getProtocolPrefix(
    Number(rateOracle.protocolId),
  )} - ${getUnderlyingTokenName(rateOracle.token)} \n

  The liquidation happened in the pool ${position.amm} \n
  The transaction id of the liquidation is ${liquidationId}
  `;
  const subject = `Liquidation of ${owner}`;
  const message = `Please check your portfolio as one of your positions was liquidated`;
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

  sendEPNSNotification(recipient, notification);
}
export const subgraphID = 'voltzprotocol/voltz-goerli'; // change to mainnet when deploying to mainnet subgraph
export default handleLiquidatePosition;
