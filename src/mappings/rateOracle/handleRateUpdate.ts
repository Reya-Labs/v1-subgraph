import { OracleBufferUpdate } from "../../../generated/templates/RateOracle/RateOracle";
import { RateOracle, RateUpdate } from "../../../generated/schema";
import { log } from "@graphprotocol/graph-ts";

function handleRateUpdate(event: OracleBufferUpdate): void {
    const rateOracleAddress = event.address.toHexString();
    const existingRateOracle = RateOracle.load(rateOracleAddress);

    if (existingRateOracle == null) {
        log.info('Event (OracleBufferUpdate: {}) cannot be linked to a rate oracle', [
            event.transaction.hash.toHexString(),
          ]);
        return;
    }

    const rateUpdate = new RateUpdate(`${rateOracleAddress}#${event.block.timestamp}`);
    rateUpdate.rateOracle = rateOracleAddress;
    rateUpdate.timestamp = event.block.timestamp;
    rateUpdate.rate = event.params.observedValue;

    rateUpdate.save();
}

export default handleRateUpdate;
