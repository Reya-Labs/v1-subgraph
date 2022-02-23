import isNull from 'lodash/isNull';

import { AMM } from '../../generated/schema';

const getOrCreateAMM = (vammAddress: string): AMM => {
  const existingAMM = AMM.load(vammAddress);

  if (!isNull(existingAMM)) {
    return existingAMM;
  }

  return new AMM(vammAddress);
};

export default getOrCreateAMM;
