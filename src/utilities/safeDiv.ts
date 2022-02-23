import { BigDecimal } from '@graphprotocol/graph-ts';

const safeDiv = (amount0: BigDecimal, amount1: BigDecimal): BigDecimal => {
  const ZERO_BD = BigDecimal.fromString('0');
  if (amount1.equals(ZERO_BD)) {
    return ZERO_BD;
  }
  return amount0.div(amount1);
};

export default safeDiv;
