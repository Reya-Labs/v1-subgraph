import { ethereum } from '@graphprotocol/graph-ts';

import saveTransaction from './saveTransaction';

const savePositionSnapshot = (position: Position, event: ethereum.Event): void => {
  const positionSnapshot = new PositionSnapshot(
    position.id.concat('#').concat(event.block.number.toString()),
  );
  positionSnapshot.owner = position.owner;
  positionSnapshot.pool = position.pool;
  positionSnapshot.position = position.id;
  positionSnapshot.blockNumber = event.block.number;
  positionSnapshot.timestamp = event.block.timestamp;
  positionSnapshot.liquidity = position.liquidity;
  positionSnapshot.depositedToken0 = position.depositedToken0;
  positionSnapshot.depositedToken1 = position.depositedToken1;
  positionSnapshot.withdrawnToken0 = position.withdrawnToken0;
  positionSnapshot.withdrawnToken1 = position.withdrawnToken1;
  positionSnapshot.collectedFeesToken0 = position.collectedFeesToken0;
  positionSnapshot.collectedFeesToken1 = position.collectedFeesToken1;
  positionSnapshot.transaction = saveTransaction(event).id;
  positionSnapshot.feeGrowthInside0LastX128 = position.feeGrowthInside0LastX128;
  positionSnapshot.feeGrowthInside1LastX128 = position.feeGrowthInside1LastX128;
  positionSnapshot.save();
};

export default savePositionSnapshot;
