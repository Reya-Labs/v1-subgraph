/* eslint-disable prettier/prettier */
import { describe, test, assert, beforeEach, clearStore } from 'matchstick-as/assembly/index';
import { newMockEvent } from 'matchstick-as';

import { Address, ethereum, BigInt } from '@graphprotocol/graph-ts';
import { randomAddresses, createIrsInstanceEvent } from '../utils';
import { handleFCMSwap } from '../../src/mappings/BaseFCM/index';
import { handleIrsInstanceDeployed } from '../../src/mappings/factory';

import { FullyCollateralisedSwap } from '../../generated/templates/BaseFCM/BaseFCM';

describe('handleFCMSwap()', () => {
  beforeEach(() => {
    clearStore();
  });

  test('Initialisation and Accumulation Check', () => {
    // aUSDC
    const irsInstanceEvent = createIrsInstanceEvent(Address.fromString('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'), 1, 6);
    handleIrsInstanceDeployed(irsInstanceEvent);

    // eslint-disable-next-line no-undef
    const fullyCollateralisedSwapEvent = changetype<FullyCollateralisedSwap>(newMockEvent());
    const eventAddress = irsInstanceEvent.params.fcm;
    const trader = randomAddresses[1];
    const desiredNotional = BigInt.fromI32(100);
    const sqrtPriceLimitX96 = BigInt.fromI32(5);
    const cumulativeFeeIncurred = BigInt.fromI32(1);
    const fixedTokenDelta = BigInt.fromI32(1500000);
    const variableTokenDelta = BigInt.fromI32(-1000000);
    const fixedTokenDeltaUnbalanced = BigInt.fromI32(1500000);

    fullyCollateralisedSwapEvent.address = eventAddress;
    fullyCollateralisedSwapEvent.parameters = [
      new ethereum.EventParam('trader', ethereum.Value.fromAddress(trader)),
      new ethereum.EventParam('desiredNotional', ethereum.Value.fromUnsignedBigInt(desiredNotional)),
      new ethereum.EventParam('sqrtPriceLimitX96', ethereum.Value.fromUnsignedBigInt(sqrtPriceLimitX96)),
      new ethereum.EventParam('cumulativeFeeIncurred', ethereum.Value.fromUnsignedBigInt(cumulativeFeeIncurred)),
      new ethereum.EventParam('fixedTokenDelta', ethereum.Value.fromSignedBigInt(fixedTokenDelta)),
      new ethereum.EventParam('variableTokenDelta', ethereum.Value.fromSignedBigInt(variableTokenDelta)),
      new ethereum.EventParam('fixedTokenDeltaUnbalanced', ethereum.Value.fromSignedBigInt(fixedTokenDeltaUnbalanced)),
    ];

    handleFCMSwap(fullyCollateralisedSwapEvent);

    assert.fieldEquals('Transaction', fullyCollateralisedSwapEvent.transaction.hash.toHexString(), 'blockNumber', fullyCollateralisedSwapEvent.block.number.toString());
    assert.fieldEquals('Transaction', fullyCollateralisedSwapEvent.transaction.hash.toHexString(), 'createdTimestamp', fullyCollateralisedSwapEvent.block.timestamp.toString());
    assert.fieldEquals('Transaction', fullyCollateralisedSwapEvent.transaction.hash.toHexString(), 'gasPrice', fullyCollateralisedSwapEvent.transaction.gasPrice.toString());
    assert.fieldEquals('Transaction', fullyCollateralisedSwapEvent.transaction.hash.toHexString(), 'blockNumber', fullyCollateralisedSwapEvent.block.number.toString());

    const fcmPositionId = `${eventAddress.toHexString()}#${trader.toHexString()}`;
    assert.fieldEquals('Wallet', trader.toHexString(), 'fcmPositionCount', '1');

    const fcmSwapId = `${fullyCollateralisedSwapEvent.transaction.hash.toHexString()}#${0}`;
    assert.fieldEquals('FCMSwap', fcmSwapId, 'transaction', fullyCollateralisedSwapEvent.transaction.hash.toHexString());
    assert.fieldEquals('FCMSwap', fcmSwapId, 'amm', irsInstanceEvent.params.vamm.toHexString());
    assert.fieldEquals('FCMSwap', fcmSwapId, 'fcmPosition', fcmPositionId);
    assert.fieldEquals('FCMSwap', fcmSwapId, 'desiredNotional', desiredNotional.toString());
    assert.fieldEquals('FCMSwap', fcmSwapId, 'sqrtPriceLimitX96', sqrtPriceLimitX96.toString());
    assert.fieldEquals('FCMSwap', fcmSwapId, 'cumulativeFeeIncurred', cumulativeFeeIncurred.toString());
    assert.fieldEquals('FCMSwap', fcmSwapId, 'fixedTokenDelta', fixedTokenDelta.toString());
    assert.fieldEquals('FCMSwap', fcmSwapId, 'variableTokenDelta', variableTokenDelta.toString());
    assert.fieldEquals('FCMSwap', fcmSwapId, 'fixedTokenDeltaUnbalanced', fixedTokenDeltaUnbalanced.toString());

    assert.fieldEquals('FCMPosition', fcmPositionId, 'owner', trader.toHexString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'createdTimestamp', fullyCollateralisedSwapEvent.block.timestamp.toString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'snapshotCount', '0');
    assert.fieldEquals('FCMPosition', fcmPositionId, 'totalNotionalTraded', variableTokenDelta.abs().toString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'sumOfWeightedFixedRate', fixedTokenDeltaUnbalanced.abs().toString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'amm', irsInstanceEvent.params.vamm.toHexString());

    // Accumulation Check
    handleFCMSwap(fullyCollateralisedSwapEvent);
    assert.fieldEquals('FCMPosition', fcmPositionId, 'owner', trader.toHexString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'createdTimestamp', fullyCollateralisedSwapEvent.block.timestamp.toString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'snapshotCount', '0');
    assert.fieldEquals('FCMPosition', fcmPositionId, 'totalNotionalTraded', variableTokenDelta.times(BigInt.fromI32(2)).abs().toString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'sumOfWeightedFixedRate', fixedTokenDeltaUnbalanced.times(BigInt.fromI32(2)).abs().toString());
    assert.fieldEquals('FCMPosition', fcmPositionId, 'amm', irsInstanceEvent.params.vamm.toHexString());
  });
});
