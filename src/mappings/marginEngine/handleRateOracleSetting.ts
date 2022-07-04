import { log } from '@graphprotocol/graph-ts';
import { RateOracle } from '../../../generated/schema';
import { RateOracleSetting } from '../../../generated/templates/MarginEngine/MarginEngine';
import { getAMMFromMarginEngineAddress } from '../../utilities';

function handleRateOracleSetting(event: RateOracleSetting): void {
  const newRateOracle = new RateOracle(event.params.rateOracle.toHexString());

  // eslint-disable-next-line no-underscore-dangle
  const marginEngine = event.address.toHexString();

  const amm = getAMMFromMarginEngineAddress(marginEngine);

  if (amm === null) {
    log.info('Event (RateOracleSetting: {}) cannot be linked to a pool', [
      event.transaction.hash.toHexString(),
    ]);
    return;
  }

  const oldRateOracle = RateOracle.load(amm.rateOracle);

  if (oldRateOracle === null) {
    log.info('Event (RateOracleSetting: {}) cannot be linked to a pool', [
      event.transaction.hash.toHexString(),
    ]);
    return;
  }

  newRateOracle.token = oldRateOracle.token;
  newRateOracle.protocolId = oldRateOracle.protocolId;
  newRateOracle.save();

  amm.rateOracle = newRateOracle.id;
  amm.save();
}

export default handleRateOracleSetting;
