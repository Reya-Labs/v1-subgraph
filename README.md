# Installation

1. Start hardhat in `voltz-core`: e.g., if running on localhost, run `yarn deploy:localhost`.
2. Place ABIs in the `artifacts/` directory: e.g., if running on localhost, copy all `.json` files from `voltz-core/deployments/localhost/` into the `artifacts/` directory.
3. Run `yarn`
4. Run `yarn generate-base-abis`
5. Start graph node: `docker-compose up`
6. Create subgraph: `yarn create-local`.
7. If running on localhost, then: (1) remove line starting with `startBlock:` from `subgraph.yaml` and (2) run `yarn remove-errors`.
8. Deploy subgraph: `yarn deploy-local`. 

## Modifying code

After any change to the `subgraph.template.yaml`, `schema.graphql`, or any files in the `src/` directory, run:

Either `yarn configure:kovan` or `configure:localhost` or `configure:mainnet`, to populate the correct contract addresses
`yarn codegen`

Do not modify any files in the `generated/` directory directly.

## Deploy to hosted service

1. Configure the hosted service using TheGraph's webapp, and save the appropriate access token in an `ACCESS_TOKEN` environment variable
2. Run `yarn configure:kovan` or `configure:localhost` or `configure:mainnet`, to populate the correct contract addresses
3. `yarn deploy`

## To reset docker

1. Remove containers: `docker-compose down`
2. Remove `data/` directory containing database files
3. Run `docker-compose up`

## Contributing

If you wish to contribute to the Voltz subgraph codebase please install husky `v7.0.2` or above to make sure your commits are checked for linting and that your commit messages are correctly formatted. Husky has been exluded from the devDependecies as it broke the npm install.

# Terms & Conditions
The Voltz Protocol, and any products or services associated therewith, is offered only to persons (aged 18 years or older) or entities who are not residents of, citizens of, are incorporated in, owned or controlled by a person or entity in, located in, or have a registered office or principal place of business in any “Restricted Territory.”  

The term Restricted Territory includes the United States of America (including its territories), Algeria, Bangladesh, Bolivia, Belarus, Myanmar (Burma), Côte d’Ivoire (Ivory Coast), Egypt, Republic of  Crimea, Cuba, Democratic Republic of the Congo, Iran, Iraq, Liberia, Libya, Mali, Morocco, Nepal, North Korea, Oman, Qatar, Somalia, Sudan, Syria, Tunisia, Venezuela, Yemen, Zimbabwe; or any jurisdictions in which the sale of cryptocurrencies are prohibited, restricted or unauthorized in any form or manner whether in full or in part under the laws, regulatory requirements or rules in such jurisdiction; or any state, country, or region that is subject to sanctions enforced by the United States, such as the Specially Designed Nationals and Blocked Persons List (“SDN List”) and Consolidated Sanctions List (“Non-SDN Lists”), the United Kingdom, or the European Union.
