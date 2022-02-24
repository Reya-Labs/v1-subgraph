import { IrsInstanceDeployed } from '../../../generated/Factory/Factory';
import { UnderlyingToken, RateOracle, AMM } from '../../../generated/schema';
import { getUnderlyingTokenName } from '../../utilities';

function handleIrsInstanceDeployed(event: IrsInstanceDeployed): void {
  const underlyingTokenAddress = event.params.underlyingToken.toHexString();
  const underlyingToken = new UnderlyingToken(underlyingTokenAddress);

  underlyingToken.name = getUnderlyingTokenName(underlyingTokenAddress);
  underlyingToken.save();

  const rateOracle = new RateOracle(event.params.rateOracle.toHexString());

  rateOracle.token = underlyingToken.id;
  rateOracle.save();

  const amm = new AMM(event.params.vamm.toHexString());

  amm.createdTimestamp = event.block.timestamp;
  amm.updatedTimestamp = event.block.timestamp;
  amm.marginEngineAddress = event.params.marginEngine.toHexString();
  amm.fcmAddress = event.params.fcm.toHexString();
  amm.rateOracle = rateOracle.id;
  amm.termStartTimestamp = event.params.termStartTimestampWad;
  amm.termEndTimestamp = event.params.termEndTimestampWad;
  amm.tickSpacing = event.params.tickSpacing;
  amm.save();
}

export default handleIrsInstanceDeployed;
