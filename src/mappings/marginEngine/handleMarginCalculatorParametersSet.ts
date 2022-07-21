import { log } from '@graphprotocol/graph-ts';
import { MarginCalculatorParametersSetting } from '../../../generated/templates/MarginEngine/MarginEngine';
import { ONE_BI } from '../../constants';
import { MarginEngine } from '../../../generated/schema';
import { createMarginCalculatorParameters } from '../../utilities';

function handleMarginCalculatorParametersSet(event: MarginCalculatorParametersSetting): void {
  const marginEngineAddress = event.address.toHexString();
  const marginEngine = MarginEngine.load(marginEngineAddress);
  if (marginEngine == null) {
    log.info('Event (MarginCalculatorParametersSetting: {}) cannot be linked to a pool', [
      event.transaction.hash.toHexString(),
    ]);
    return;
  }

  const marginCalculatorParameters = createMarginCalculatorParameters(
    `${marginEngine.id}#${marginEngine.mcpCount.toString()}`,
    event.params.marginCalculatorParameters.apyUpperMultiplierWad,
    event.params.marginCalculatorParameters.apyLowerMultiplierWad,
    event.params.marginCalculatorParameters.sigmaSquaredWad,
    event.params.marginCalculatorParameters.alphaWad,
    event.params.marginCalculatorParameters.betaWad,
    event.params.marginCalculatorParameters.xiUpperWad,
    event.params.marginCalculatorParameters.xiLowerWad,
    event.params.marginCalculatorParameters.tMaxWad,
    event.params.marginCalculatorParameters.devMulLeftUnwindLMWad,
    event.params.marginCalculatorParameters.devMulRightUnwindLMWad,
    event.params.marginCalculatorParameters.devMulLeftUnwindIMWad,
    event.params.marginCalculatorParameters.devMulRightUnwindIMWad,
    event.params.marginCalculatorParameters.fixedRateDeviationMinLeftUnwindLMWad,
    event.params.marginCalculatorParameters.fixedRateDeviationMinRightUnwindLMWad,
    event.params.marginCalculatorParameters.fixedRateDeviationMinLeftUnwindIMWad,
    event.params.marginCalculatorParameters.fixedRateDeviationMinRightUnwindIMWad,
    event.params.marginCalculatorParameters.gammaWad,
    event.params.marginCalculatorParameters.minMarginToIncentiviseLiquidators,
  );
  marginCalculatorParameters.save();

  marginEngine.mcpCount = marginEngine.mcpCount.plus(ONE_BI);
  marginEngine.marginCalculatorParameters = marginCalculatorParameters.id;
  marginEngine.save();
}

export default handleMarginCalculatorParametersSet;
