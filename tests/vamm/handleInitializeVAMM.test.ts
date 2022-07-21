/* eslint-disable prefer-destructuring */
/* eslint-disable no-bitwise */
/* eslint-disable prettier/prettier */
import { describe, test, assert, beforeEach, clearStore, newMockEvent } from 'matchstick-as/assembly/index';
import { BigInt, ethereum } from '@graphprotocol/graph-ts';

import { handleInitializeVAMM } from '../../src/mappings/vamm/index';
import { randomAddresses } from '../utils';
import { VAMMInitialization } from '../../generated/templates/VAMM/VAMM';

describe('handleInitializeVAMM()', () => {
  beforeEach(() => {
    clearStore();
  });

  test('One VAMM initialization', () => {
    const VAMMInitializationEvent = changetype<VAMMInitialization>(newMockEvent());
    VAMMInitializationEvent.address = randomAddresses[5];
    VAMMInitializationEvent.parameters = [
      new ethereum.EventParam('sqrtPriceX96', ethereum.Value.fromUnsignedBigInt((BigInt.fromI32(101) << 96).div(BigInt.fromI32(100)))),
      new ethereum.EventParam('tick', ethereum.Value.fromI32(200))
    ];

    assert.notInStore('AMM', VAMMInitializationEvent.address.toHexString());
    handleInitializeVAMM(VAMMInitializationEvent);
    assert.fieldEquals('AMM', VAMMInitializationEvent.address.toHexString(), 'tick', '200');
  });

  test('Two subsequent VAMM initializations', () => {
    {
      const VAMMInitializationEvent = changetype<VAMMInitialization>(newMockEvent());
      VAMMInitializationEvent.address = randomAddresses[5];
      VAMMInitializationEvent.parameters = [
        new ethereum.EventParam('sqrtPriceX96', ethereum.Value.fromUnsignedBigInt((BigInt.fromI32(101) << 96).div(BigInt.fromI32(100)))),
        new ethereum.EventParam('tick', ethereum.Value.fromI32(200)),
      ];
      
      assert.notInStore('AMM', VAMMInitializationEvent.address.toHexString());
      handleInitializeVAMM(VAMMInitializationEvent);
      assert.fieldEquals('AMM', VAMMInitializationEvent.address.toHexString(), 'tick', '200');
    }

    {
      const VAMMInitializationEvent = changetype<VAMMInitialization>(newMockEvent());
      VAMMInitializationEvent.address = randomAddresses[5];
      VAMMInitializationEvent.parameters = [
        new ethereum.EventParam('sqrtPriceX96', ethereum.Value.fromUnsignedBigInt((BigInt.fromI32(11) << 96).div(BigInt.fromI32(100)))),
        new ethereum.EventParam('tick', ethereum.Value.fromI32(2000))
      ];
      
      assert.fieldEquals('AMM', VAMMInitializationEvent.address.toHexString(), 'tick', '200');
      handleInitializeVAMM(VAMMInitializationEvent);
      assert.fieldEquals('AMM', VAMMInitializationEvent.address.toHexString(), 'tick', '2000');
    }
  });
});
