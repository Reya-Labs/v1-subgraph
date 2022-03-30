# Installation

1. Run `yarn`
2. Start graph node: `docker-compose up`
3. Place ABIs in the `artifacts/` directory
4. In `voltz-core`, start `hardhat`: `npx hardhat node --hostname 0.0.0.0`
5. Create subgraph: `yarn create-local`
6. Deploy subgraph: `yarn deploy-local`

## Modifying code

After any change to the `subgraph.yaml.template`, `schema.graphql`, or any files in the `src/` directory, run:

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
