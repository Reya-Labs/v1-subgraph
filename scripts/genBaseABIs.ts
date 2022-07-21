/* eslint-disable no-console */
import fs from 'fs';

interface Info {
  filename: string;
  specialisedFunctionNames: string[];
}

// eslint-disable-next-line consistent-return
function genBaseABI(infos: Info[], baseJsonName: string): void {
  let generatedBase = false;
  // eslint-disable-next-line no-restricted-syntax
  for (const info of infos) {
    const file = fs.readFileSync(`./artifacts/${info.filename}`, {
      encoding: 'utf8',
      flag: 'r',
    });

    if (!file) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const json = JSON.parse(file);
    for (let i = 0; i < json.abi.length; i += 1) {
      if (
        info.specialisedFunctionNames.includes(json.abi[i].name) ||
        info.specialisedFunctionNames.includes(json.abi[i].type)
      ) {
        json.abi.splice(i, 1);
        i -= 1;
      }
    }

    fs.writeFileSync(`./artifacts/${baseJsonName}`, JSON.stringify(json));
    generatedBase = true;
    break;
  }

  if (!generatedBase) {
    return console.log(
      `Unable to generate base ${baseJsonName} since no specialised JSON files were found`,
    );
  }
}

// eslint-disable-next-line consistent-return
const genBaseABIs = () => {
  if (!fs.existsSync('./artifacts')) {
    return console.log('Artifacts directory empty');
  }

  // Base FCM
  const fcmInfos: Info[] = [
    {
      filename: 'AaveFCM.json',
      specialisedFunctionNames: [
        'aaveLendingPool',
        'getTraderMarginInATokens',
        'underlyingYieldBearingToken',
      ],
    },
    {
      filename: 'CompoundFCM.json',
      specialisedFunctionNames: ['cToken', 'getTraderMarginInCTokens'],
    },
  ];

  genBaseABI(fcmInfos, 'BaseFCM.json');

  // Base Rate Oracle
  const rateOracleInfos: Info[] = [
    {
      filename: 'AaveRateOracle_USDC.json',
      specialisedFunctionNames: ['constructor', 'aaveLendingPool'],
    },
    {
      filename: 'AaveRateOracle_DAI.json',
      specialisedFunctionNames: ['constructor', 'aaveLendingPool'],
    },
    {
      filename: 'CompoundRateOracle_cDAI.json',
      specialisedFunctionNames: ['constructor', 'cToken', 'decimals'],
    },
    {
      filename: 'LidoRateOracle.json',
      specialisedFunctionNames: ['constructor', 'lidoOracle', 'refreshBeaconSpec', 'stEth'],
    },
    {
      filename: 'RocketPoolRateOracle.json',
      specialisedFunctionNames: ['constructor', 'rocketEth', 'rocketNetworkBalances'],
    },
  ];

  genBaseABI(rateOracleInfos, 'BaseRateOracle.json');
};

genBaseABIs();
