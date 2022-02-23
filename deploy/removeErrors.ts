import fs from 'fs';

const removeErrors = () => {
  if (!fs.existsSync('./artifacts')) {
    fs.mkdirSync('./artifacts');
  }

  const deploymentFile = fs.readFileSync('./localhostDeployment.json', {
    encoding: 'utf8',
    flag: 'r',
  });

  if (!deploymentFile) {
    return console.log('DEPLOYMENT FILE EMPTY');
  }

  const { contracts } = JSON.parse(deploymentFile);

  Object.keys(contracts).forEach((contractName) => {
    const { abi: abiWithErrors } = contracts[contractName];

    const abi = abiWithErrors.reduce((acc: any, { type, ...rest }: Record<string, unknown>) => {
      if (type === 'error') {
        return acc;
      }

      return [
        ...acc,
        {
          type,
          ...rest,
        },
      ];
    }, []);

    fs.writeFileSync(`artifacts/${contractName}.json`, JSON.stringify({ abi }));
  });
};

removeErrors();
