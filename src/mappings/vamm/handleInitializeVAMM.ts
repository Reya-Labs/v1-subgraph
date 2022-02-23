import { BigInt, BigDecimal } from '@graphprotocol/graph-ts';
import { InitializeVAMM } from '../../../generated/templates/VAMM/VAMM';
import { AMM } from '../../../generated/schema';
import { safeDiv } from '../../utilities/index';

function handleInitializeVAMM(event: InitializeVAMM): void {
  const id = event.transaction.to;
  const amm = AMM.load(id!.toString());
  const sqrtPriceX96 = Number(event.params.sqrtPriceX96);
  const exp = Number(BigInt.fromString('2').pow(96));
  const denom = BigDecimal.fromString((sqrtPriceX96 / exp ** 2).toString());
  const fixedApr = safeDiv(BigDecimal.fromString('1'), denom);
  amm!.fixedApr = BigInt.fromString(fixedApr.toString());
  amm!.save();
}

export default handleInitializeVAMM;
