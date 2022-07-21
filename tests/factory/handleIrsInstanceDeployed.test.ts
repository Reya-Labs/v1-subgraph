/* eslint-disable prettier/prettier */
import { describe, test, assert, beforeEach, clearStore } from 'matchstick-as/assembly/index';

import { Address } from '@graphprotocol/graph-ts';
import { createIrsInstanceEvent } from '../utils';
import { handleIrsInstanceDeployed } from '../../src/mappings/factory';

describe('handleIrsInstanceDeployed()', () => {
  beforeEach(() => {
    clearStore();
  });

  test('Init Test', () => {
    // mainnet USDC
    const irsInstanceEvent = createIrsInstanceEvent(Address.fromString('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'), 1, 6);
    handleIrsInstanceDeployed(irsInstanceEvent);
    const marginEngine = irsInstanceEvent.params.marginEngine.toHexString();
    const vamm = irsInstanceEvent.params.vamm.toHexString();
    const fcm = irsInstanceEvent.params.fcm.toHexString();
    const rateOracle = irsInstanceEvent.params.rateOracle.toHexString();
    const underlyingToken = irsInstanceEvent.params.underlyingToken.toHexString();

    assert.fieldEquals('UnderlyingToken', underlyingToken, 'name', 'USDC');
    assert.fieldEquals('UnderlyingToken', underlyingToken, 'decimals', '6');

    assert.fieldEquals('RateOracle', rateOracle, 'protocolId', '1');
    assert.fieldEquals('RateOracle', rateOracle, 'token', underlyingToken);

    assert.fieldEquals('AMM', vamm, 'createdTimestamp', irsInstanceEvent.block.timestamp.toString());
    assert.fieldEquals('AMM', vamm, 'updatedTimestamp', irsInstanceEvent.block.timestamp.toString());
    assert.fieldEquals('AMM', vamm, 'fcm', fcm);
    assert.fieldEquals('AMM', vamm, 'marginEngine', marginEngine);
    assert.fieldEquals('AMM', vamm, 'rateOracle', rateOracle);
    assert.fieldEquals('AMM', vamm, 'termStartTimestamp', irsInstanceEvent.params.termStartTimestampWad.toString());
    assert.fieldEquals('AMM', vamm, 'termEndTimestamp', irsInstanceEvent.params.termEndTimestampWad.toString());
    assert.fieldEquals('AMM', vamm, 'tickSpacing', irsInstanceEvent.params.tickSpacing.toString());

    assert.fieldEquals('MarginEngine', marginEngine, 'amm', vamm);

    assert.fieldEquals('FCM', fcm, 'amm', vamm);
  });
});
