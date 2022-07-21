import { ethereum, Address, BigInt } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as';
import { IrsInstance } from '../generated/Factory/Factory';

import { VAMMPriceChange } from '../generated/templates/VAMM/VAMM';

const defaultVAMMAddress = Address.fromString('0xa16081f360e3847006db660bae1c6d1b2e17ec2a');

export const randomAddresses: Address[] = [
  Address.fromString('0x98f2f99f5b4a33d2306567122a0b9904c14427e7'),
  Address.fromString('0x19e34af51a4f6cef4b266974de09767302cd1407'),
  Address.fromString('0x2f68f7458f77de70043fa7fd23d27bb81fae8766'),
  Address.fromString('0xcb4b04e2676b68a85bae63dcdef7dd8b07ec0e65'),
  Address.fromString('0xd21c561130b564810111c4e5434ef58fbfcdfc3d'),
  Address.fromString('0x4919cf50a269189f9135acc4d3df62b64de31d88'),
  Address.fromString('0x65ed800ccb3efcdd3d0451431d79ef57952dcb3c'),
  Address.fromString('0x6cf37b2d8da310039aa8c5efb05cd6002af7bb00'),
  Address.fromString('0x42f47b8eaca9ed1d5be11d68846db5cbc72404c5'),
  Address.fromString('0x4180de4881c77ba81862636fce01345cbb07ab3c'),
];

export function createIrsInstanceEvent(
  _underlyingToken: Address,
  _yieldBearingProtocolID: i32,
  _underlyingTokenDecimals: i32,
): IrsInstance {
  const irsInstanceEvent = changetype<IrsInstance>(newMockEvent());
  const eventAddress = randomAddresses[0];
  const underlyingToken = _underlyingToken;
  const rateOracle = randomAddresses[1];
  const termStartTimestampWad = BigInt.fromI32(123);
  const termEndTimestampWad = BigInt.fromI32(456);
  const tickSpacing = 30;
  const marginEngine = randomAddresses[2];
  const vamm = randomAddresses[3];
  const fcm = randomAddresses[4];
  const yieldBearingProtocolID = _yieldBearingProtocolID;
  const underlyingTokenDecimals = _underlyingTokenDecimals;

  irsInstanceEvent.address = eventAddress;
  irsInstanceEvent.parameters = [
    new ethereum.EventParam('underlyingToken', ethereum.Value.fromAddress(underlyingToken)),
    new ethereum.EventParam('rateOracle', ethereum.Value.fromAddress(rateOracle)),
    new ethereum.EventParam('termStartTimestampWad', ethereum.Value.fromUnsignedBigInt(termStartTimestampWad)),
    new ethereum.EventParam('termEndTimestampWad', ethereum.Value.fromUnsignedBigInt(termEndTimestampWad)),
    new ethereum.EventParam('tickSpacing', ethereum.Value.fromI32(tickSpacing)),
    new ethereum.EventParam('marginEngine', ethereum.Value.fromAddress(marginEngine)),
    new ethereum.EventParam('vamm', ethereum.Value.fromAddress(vamm)),
    new ethereum.EventParam('fcm', ethereum.Value.fromAddress(fcm)),
    new ethereum.EventParam('yieldBearingProtocolID', ethereum.Value.fromI32(yieldBearingProtocolID)),
    new ethereum.EventParam('underlyingTokenDecimals', ethereum.Value.fromI32(underlyingTokenDecimals)),
  ];

  return irsInstanceEvent;
}

export function getVAMMPriceChangeEvent(
  tick: i32,
  vammAddress: Address = defaultVAMMAddress,
): VAMMPriceChange {
  const vammPriceChangeEvent = changetype<VAMMPriceChange>(newMockEvent());
  vammPriceChangeEvent.address = vammAddress;
  vammPriceChangeEvent.parameters = [new ethereum.EventParam('tick', ethereum.Value.fromI32(tick))];
  return vammPriceChangeEvent;
}
