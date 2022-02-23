import { IrsInstanceDeployed } from '../../../generated/Factory/Factory';
import { AMM } from '../../../generated/schema';

function handleIrsInstanceDeployed(event: IrsInstanceDeployed): void {
  const amm = new AMM(event.params.vamm.toHexString());

  amm.marginEngineAddress = event.params.marginEngin.toHexString();
  amm.termStartTimestamp = event.params.termStartTimestampWad;
  amm.termEndTimestamp = event.params.termEndTimestampWad;
  amm.save();
}

export default handleIrsInstanceDeployed;
