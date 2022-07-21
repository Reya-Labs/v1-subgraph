import { BigInt } from '@graphprotocol/graph-ts';

import { MarginCalculatorParameters } from '../../generated/schema';
import { ZERO_BI } from '../constants';

const createMarginCalculatorParameters = (
  MarginCalculatorParametersID: string,
  apyUpperMultiplierWad: BigInt = ZERO_BI,
  apyLowerMultiplierWad: BigInt = ZERO_BI,
  sigmaSquaredWad: BigInt = ZERO_BI,
  alphaWad: BigInt = ZERO_BI,
  betaWad: BigInt = ZERO_BI,
  xiUpperWad: BigInt = ZERO_BI,
  xiLowerWad: BigInt = ZERO_BI,
  tMaxWad: BigInt = ZERO_BI,
  devMulLeftUnwindLMWad: BigInt = ZERO_BI,
  devMulRightUnwindLMWad: BigInt = ZERO_BI,
  devMulLeftUnwindIMWad: BigInt = ZERO_BI,
  devMulRightUnwindIMWad: BigInt = ZERO_BI,
  fixedRateDeviationMinLeftUnwindLMWad: BigInt = ZERO_BI,
  fixedRateDeviationMinRightUnwindLMWad: BigInt = ZERO_BI,
  fixedRateDeviationMinLeftUnwindIMWad: BigInt = ZERO_BI,
  fixedRateDeviationMinRightUnwindIMWad: BigInt = ZERO_BI,
  gammaWad: BigInt = ZERO_BI,
  minMarginToIncentiviseLiquidators: BigInt = ZERO_BI,
): MarginCalculatorParameters => {
  const marginCalculatorParameters = new MarginCalculatorParameters(MarginCalculatorParametersID);

  marginCalculatorParameters.apyUpperMultiplierWad = apyUpperMultiplierWad;
  marginCalculatorParameters.apyLowerMultiplierWad = apyLowerMultiplierWad;
  marginCalculatorParameters.sigmaSquaredWad = sigmaSquaredWad;
  marginCalculatorParameters.alphaWad = alphaWad;
  marginCalculatorParameters.betaWad = betaWad;
  marginCalculatorParameters.xiUpperWad = xiUpperWad;
  marginCalculatorParameters.xiLowerWad = xiLowerWad;
  marginCalculatorParameters.tMaxWad = tMaxWad;
  marginCalculatorParameters.devMulLeftUnwindLMWad = devMulLeftUnwindLMWad;
  marginCalculatorParameters.devMulRightUnwindLMWad = devMulRightUnwindLMWad;
  marginCalculatorParameters.devMulLeftUnwindIMWad = devMulLeftUnwindIMWad;
  marginCalculatorParameters.devMulRightUnwindIMWad = devMulRightUnwindIMWad;
  marginCalculatorParameters.fixedRateDeviationMinLeftUnwindLMWad = fixedRateDeviationMinLeftUnwindLMWad;
  marginCalculatorParameters.fixedRateDeviationMinRightUnwindLMWad = fixedRateDeviationMinRightUnwindLMWad;
  marginCalculatorParameters.fixedRateDeviationMinLeftUnwindIMWad = fixedRateDeviationMinLeftUnwindIMWad;
  marginCalculatorParameters.fixedRateDeviationMinRightUnwindIMWad = fixedRateDeviationMinRightUnwindIMWad;
  marginCalculatorParameters.gammaWad = gammaWad;
  marginCalculatorParameters.minMarginToIncentiviseLiquidators = minMarginToIncentiviseLiquidators;
  marginCalculatorParameters.save();

  return marginCalculatorParameters;
};

export default createMarginCalculatorParameters;
