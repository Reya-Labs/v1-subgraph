/* eslint-disable prettier/prettier */
import { describe, test, assert, beforeEach, clearStore } from 'matchstick-as/assembly/index';
import { newMockEvent } from 'matchstick-as';

import { Address, ethereum, BigInt } from '@graphprotocol/graph-ts';
import { randomAddresses, createIrsInstanceEvent } from '../utils';
import { handleSettleFCMPosition } from '../../src/mappings/BaseFCM/index';
import { handleIrsInstanceDeployed } from '../../src/mappings/factory';

import { fcmPositionSettlement } from '../../generated/templates/BaseFCM/BaseFCM';

describe('handleSettleFCMPosition()', () => {
  beforeEach(() => {
    clearStore();
  });

  test('Initialisation Check', () => {
    // aUSDC
    const irsInstanceEvent = createIrsInstanceEvent(Address.fromString('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'), 1, 6);
    handleIrsInstanceDeployed(irsInstanceEvent);

    // eslint-disable-next-line no-undef
    const fcmPositionSettlementEvent = changetype<fcmPositionSettlement>(newMockEvent());
    const eventAddress = irsInstanceEvent.params.fcm;
    const trader = randomAddresses[8];
    const settlementCashflow = BigInt.fromI32(100);

    fcmPositionSettlementEvent.address = eventAddress;
    fcmPositionSettlementEvent.parameters = [
      new ethereum.EventParam('trader', ethereum.Value.fromAddress(trader)),
      new ethereum.EventParam('settlementCashflow', ethereum.Value.fromUnsignedBigInt(settlementCashflow)),
    ];

    handleSettleFCMPosition(fcmPositionSettlementEvent);

    const fcmPositionId = `${eventAddress.toHexString()}#${trader.toHexString()}`;
    assert.fieldEquals('FCMPosition', fcmPositionId, 'isSettled', 'true');

    const fcmSettlementId = `${fcmPositionSettlementEvent.transaction.hash.toHexString()}#${0}`;
    assert.fieldEquals('FCMSettlement', fcmSettlementId, 'transaction', fcmPositionSettlementEvent.transaction.hash.toHexString());
    assert.fieldEquals('FCMSettlement', fcmSettlementId, 'amm', irsInstanceEvent.params.vamm.toHexString());
    assert.fieldEquals('FCMSettlement', fcmSettlementId, 'fcmPosition', fcmPositionId);
    assert.fieldEquals('FCMSettlement', fcmSettlementId, 'settlementCashflow', settlementCashflow.toString());

    assert.fieldEquals('AMM', irsInstanceEvent.params.vamm.toHexString(), 'txCount', '1');
  });
});
