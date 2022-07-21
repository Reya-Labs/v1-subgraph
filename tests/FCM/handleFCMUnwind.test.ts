/* eslint-disable prettier/prettier */
import { describe, test, assert, beforeEach, clearStore } from 'matchstick-as/assembly/index';
import { newMockEvent } from 'matchstick-as';

import { Address, ethereum, BigInt } from '@graphprotocol/graph-ts';
import { randomAddresses, createIrsInstanceEvent } from '../utils';
import { handleFCMUnwind } from '../../src/mappings/BaseFCM/index';
import { handleIrsInstanceDeployed } from '../../src/mappings/factory';

import { FullyCollateralisedUnwind } from '../../generated/templates/BaseFCM/BaseFCM';

describe('handleFCMUnwind()', () => {
  beforeEach(() => {
    clearStore();
  });

  test('Initialisation and Accumulation Check', () => {
    // aUSDC
    const irsInstanceEvent = createIrsInstanceEvent(Address.fromString('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'), 1, 6);
    handleIrsInstanceDeployed(irsInstanceEvent);

    // eslint-disable-next-line no-undef
    const fullyCollateralisedUnwindEvent = changetype<FullyCollateralisedUnwind>(newMockEvent());
    const eventAddress = irsInstanceEvent.params.fcm;
    const trader = randomAddresses[4];
    const desiredNotional = BigInt.fromI32(123456);
    const sqrtPriceLimitX96 = BigInt.fromI32(321);
    const cumulativeFeeIncurred = BigInt.fromI32(11);
    const fixedTokenDelta = BigInt.fromI32(-1100000);
    const variableTokenDelta = BigInt.fromI32(1000000);
    const fixedTokenDeltaUnbalanced = BigInt.fromI32(-1000000);

    fullyCollateralisedUnwindEvent.address = eventAddress;
    fullyCollateralisedUnwindEvent.parameters = [
      new ethereum.EventParam('trader', ethereum.Value.fromAddress(trader)),
      new ethereum.EventParam('desiredNotional', ethereum.Value.fromUnsignedBigInt(desiredNotional)),
      new ethereum.EventParam('sqrtPriceLimitX96', ethereum.Value.fromUnsignedBigInt(sqrtPriceLimitX96)),
      new ethereum.EventParam('cumulativeFeeIncurred', ethereum.Value.fromUnsignedBigInt(cumulativeFeeIncurred)),
      new ethereum.EventParam('fixedTokenDelta', ethereum.Value.fromUnsignedBigInt(fixedTokenDelta)),
      new ethereum.EventParam('variableTokenDelta', ethereum.Value.fromUnsignedBigInt(variableTokenDelta)),
      new ethereum.EventParam('fixedTokenDeltaUnbalanced', ethereum.Value.fromUnsignedBigInt(fixedTokenDeltaUnbalanced)),
    ];

    handleFCMUnwind(fullyCollateralisedUnwindEvent);

    const fcmPositionId = `${eventAddress.toHexString()}#${trader.toHexString()}`;
    assert.fieldEquals('FCMPosition', fcmPositionId, 'owner', trader.toHexString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'createdTimestamp', fullyCollateralisedUnwindEvent.block.timestamp.toString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'snapshotCount', '0');
    assert.fieldEquals('FCMPosition', fcmPositionId, 'totalNotionalTraded', variableTokenDelta.abs().toString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'sumOfWeightedFixedRate', fixedTokenDeltaUnbalanced.abs().toString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'amm', irsInstanceEvent.params.vamm.toHexString());
    
    const fcmUnwindId = `${fullyCollateralisedUnwindEvent.transaction.hash.toHexString()}#${0}`;
    assert.fieldEquals('FCMUnwind', fcmUnwindId, 'transaction', fullyCollateralisedUnwindEvent.transaction.hash.toHexString());
    assert.fieldEquals('FCMUnwind', fcmUnwindId, 'amm', irsInstanceEvent.params.vamm.toHexString());
    assert.fieldEquals('FCMUnwind', fcmUnwindId, 'fcmPosition', fcmPositionId);
    assert.fieldEquals('FCMUnwind', fcmUnwindId, 'desiredNotional', desiredNotional.toString());
    assert.fieldEquals('FCMUnwind', fcmUnwindId, 'sqrtPriceLimitX96', sqrtPriceLimitX96.toString());
    assert.fieldEquals('FCMUnwind', fcmUnwindId, 'cumulativeFeeIncurred', cumulativeFeeIncurred.toString());
    assert.fieldEquals('FCMUnwind', fcmUnwindId, 'fixedTokenDelta', fixedTokenDelta.toString());
    assert.fieldEquals('FCMUnwind', fcmUnwindId, 'variableTokenDelta', variableTokenDelta.toString());
    assert.fieldEquals('FCMUnwind', fcmUnwindId, 'fixedTokenDeltaUnbalanced', fixedTokenDeltaUnbalanced.toString());

    // Accumulation Check
    handleFCMUnwind(fullyCollateralisedUnwindEvent);
    assert.fieldEquals('FCMPosition', fcmPositionId, 'owner', trader.toHexString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'createdTimestamp', fullyCollateralisedUnwindEvent.block.timestamp.toString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'snapshotCount', '0');
    assert.fieldEquals('FCMPosition', fcmPositionId, 'totalNotionalTraded', variableTokenDelta.times(BigInt.fromI32(2)).abs().toString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'sumOfWeightedFixedRate', fixedTokenDeltaUnbalanced.times(BigInt.fromI32(2)).abs().toString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'amm', irsInstanceEvent.params.vamm.toHexString());
  
  });
});
