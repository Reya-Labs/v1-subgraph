import { BigDecimal } from '@graphprotocol/graph-ts';
import { AMM } from '../../../generated/schema';
import { InitializeVAMM } from '../../../generated/templates/VAMM/VAMM';
import { safeDiv } from '../../utilities/index';

function handleInitializeVAMM(event: InitializeVAMM): void {
  const id = event.transaction.to;
  const amm = AMM.load(id!.toString());
  const { sqrtPriceX96 } = event.params;
  const denom = (Number(sqrtPriceX96) / 2 ** 96) ** 2;
  amm!.fixedApr = safeDiv(BigDecimal.fromString('1'), BigDecimal.fromString(denom.toString()));
  amm!.save();
}

export default handleInitializeVAMM;
