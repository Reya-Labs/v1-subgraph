import isNull from 'lodash/isNull';
import { BigInt } from '@graphprotocol/graph-ts';

import { AMM, Tick } from '../../generated/schema';

export type GetOrCreateTickArgs = {
  amm: AMM;
  value: BigInt;
};

const getOrCreateTick = ({ amm, value }: GetOrCreateTickArgs): Tick => {
  const tickId = `${amm.id}#${value}`;
  const existingTick = Tick.load(tickId);

  if (!isNull(existingTick)) {
    return existingTick;
  }

  const tick = new Tick(tickId);

  tick.value = value;
  tick.amm = amm.id;
  tick.save();

  return tick;
};

export default getOrCreateTick;
