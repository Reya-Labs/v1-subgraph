import { Address } from '@graphprotocol/graph-ts';
import { describe, test, assert, beforeEach, clearStore } from 'matchstick-as/assembly/index';

import { handleVAMMPriceChange } from '../../src/mappings/vamm/index';
import { getVAMMPriceChangeEvent } from '../utils';

describe('handleVAMMPriceChange()', () => {
  beforeEach(() => {
    clearStore();
  });

  test('One price change in non-initialized VAMM', () => {
    const vammPriceChangeEvent = getVAMMPriceChangeEvent(12);
    assert.notInStore('AMM', vammPriceChangeEvent.address.toHexString());
    handleVAMMPriceChange(vammPriceChangeEvent);
    assert.fieldEquals('AMM', vammPriceChangeEvent.address.toHexString(), 'tick', '12');
  });

  test('Two price changes in non-initialized VAMM', () => {
    {
      const vammPriceChangeEvent = getVAMMPriceChangeEvent(12);
      assert.notInStore('AMM', vammPriceChangeEvent.address.toHexString());
      handleVAMMPriceChange(vammPriceChangeEvent);
      assert.fieldEquals('AMM', vammPriceChangeEvent.address.toHexString(), 'tick', '12');
    }

    {
      const vammPriceChangeEvent = getVAMMPriceChangeEvent(13);
      assert.fieldEquals('AMM', vammPriceChangeEvent.address.toHexString(), 'tick', '12');
      handleVAMMPriceChange(vammPriceChangeEvent);
      assert.fieldEquals('AMM', vammPriceChangeEvent.address.toHexString(), 'tick', '13');
    }
  });

  test('Price changes in two non-initialized VAMMS', () => {
    {
      const vammPriceChangeEvent = getVAMMPriceChangeEvent(
        10,
        Address.fromString('0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'),
      );
      assert.notInStore('AMM', vammPriceChangeEvent.address.toHexString());
      handleVAMMPriceChange(vammPriceChangeEvent);
      assert.fieldEquals('AMM', vammPriceChangeEvent.address.toHexString(), 'tick', '10');
    }

    {
      const vammPriceChangeEvent = getVAMMPriceChangeEvent(
        11,
        Address.fromString('0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'),
      );
      assert.notInStore('AMM', vammPriceChangeEvent.address.toHexString());
      handleVAMMPriceChange(vammPriceChangeEvent);
      assert.fieldEquals('AMM', vammPriceChangeEvent.address.toHexString(), 'tick', '11');
    }

    {
      const vammPriceChangeEvent = getVAMMPriceChangeEvent(
        100,
        Address.fromString('0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'),
      );
      assert.fieldEquals('AMM', vammPriceChangeEvent.address.toHexString(), 'tick', '10');
      handleVAMMPriceChange(vammPriceChangeEvent);
      assert.fieldEquals('AMM', vammPriceChangeEvent.address.toHexString(), 'tick', '100');
      assert.fieldEquals(
        'AMM',
        Address.fromString('0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB').toHexString(),
        'tick',
        '11',
      );
    }
  });
});
