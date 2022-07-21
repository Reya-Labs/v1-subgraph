/* eslint-disable prettier/prettier */
import { describe, test, assert, beforeEach, clearStore } from 'matchstick-as/assembly/index';
import { newMockEvent } from 'matchstick-as';

import { Address, ethereum, BigInt } from '@graphprotocol/graph-ts';
import { randomAddresses, createIrsInstanceEvent } from '../utils';
import { handleFCMTraderUpdate } from '../../src/mappings/BaseFCM/index';
import { handleIrsInstanceDeployed } from '../../src/mappings/factory';

import { FCMTraderUpdate } from '../../generated/templates/BaseFCM/BaseFCM';

describe('handleFCMTraderUpdate()', () => {
  beforeEach(() => {
    clearStore();
  });

  test('Initialisation Check', () => {
    const irsInstanceEvent = createIrsInstanceEvent(Address.fromString('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'), 1, 6);
    handleIrsInstanceDeployed(irsInstanceEvent);

    // eslint-disable-next-line no-undef
    const FCMTraderUpdateEvent = changetype<FCMTraderUpdate>(newMockEvent());
    const eventAddress = irsInstanceEvent.params.fcm;
    const trader = randomAddresses[0];
    const marginInScaledYieldBearingTokens = BigInt.fromI32(48);
    const fixedTokenBalance = BigInt.fromI32(1000000);
    const variableTokenBalance = BigInt.fromI32(-1000000);

    FCMTraderUpdateEvent.address = eventAddress;
    FCMTraderUpdateEvent.parameters = [
      new ethereum.EventParam('trader', ethereum.Value.fromAddress(trader)),
      new ethereum.EventParam('marginInScaledYieldBearingTokens', ethereum.Value.fromUnsignedBigInt(marginInScaledYieldBearingTokens)),
      new ethereum.EventParam('fixedTokenBalance', ethereum.Value.fromUnsignedBigInt(fixedTokenBalance)),
      new ethereum.EventParam('variableTokenBalance', ethereum.Value.fromUnsignedBigInt(variableTokenBalance)),
    ];

    handleFCMTraderUpdate(FCMTraderUpdateEvent);

    const fcmPositionId = `${eventAddress.toHexString()}#${trader.toHexString()}`;
    assert.fieldEquals('FCMPosition', fcmPositionId, 'owner', trader.toHexString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'createdTimestamp', FCMTraderUpdateEvent.block.timestamp.toString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'fixedTokenBalance', fixedTokenBalance.toString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'variableTokenBalance', variableTokenBalance.toString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'marginInScaledYieldBearingTokens', marginInScaledYieldBearingTokens.toString());
  });
});
