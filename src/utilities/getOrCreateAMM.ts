import isNull from 'lodash/isNull';

import { AMM } from '../../generated/schema';

const getOrCreateAMM = (address: string): AMM => {
  const existingAMM = AMM.load(address);

  if (!isNull(existingAMM)) {
    return existingAMM;
  }

  return new AMM(address);
};

export default getOrCreateAMM;
