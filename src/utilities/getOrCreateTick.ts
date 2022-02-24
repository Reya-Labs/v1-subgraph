import { BigInt } from '@graphprotocol/graph-ts';

import { AMM, Tick } from '../../generated/schema';

const getOrCreateTick = (amm: AMM, value: BigInt): Tick => {
  const tickId = `${amm.id}#${value}`;
  const existingTick = Tick.load(tickId);

  if (existingTick !== null) {
    return existingTick;
  }

  const tick = new Tick(tickId);

  tick.value = value;
  tick.amm = amm.id;
  tick.save();

  return tick;
};

export default getOrCreateTick;
