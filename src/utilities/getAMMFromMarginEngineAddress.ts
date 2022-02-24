import { AMM, MarginEngine } from '../../generated/schema';

const getAMMFromMarginEngineAddress = (marginEngineAddress: string): AMM | null => {
  const marginEngine = MarginEngine.load(marginEngineAddress);

  if (marginEngine === null) {
    return null;
  }

  const amm = AMM.load(marginEngine.amm);

  if (amm !== null) {
    return amm;
  }

  return null;
};

export default getAMMFromMarginEngineAddress;
