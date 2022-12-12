import { BigInt } from '@graphprotocol/graph-ts';

export const getProtocolPrefix = (protocolId: BigInt): string => {
  if (protocolId.equals(BigInt.fromU32(1))) {
    return 'Aave';
  }
  if (protocolId.equals(BigInt.fromU32(2))) {
    return 'Compound';
  }
  if (protocolId.equals(BigInt.fromU32(3))) {
    return 'Lido';
  }
  if (protocolId.equals(BigInt.fromU32(4))) {
    return 'Rocket';
  }
  if (protocolId.equals(BigInt.fromU32(5))) {
    return 'Aave Borrow';
  }
  if (protocolId.equals(BigInt.fromU32(6))) {
    return 'Compound Borrow';
  }

  return 'Unkown Protocol';
};
