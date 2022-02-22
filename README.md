# Installation

1. Run `yarn`
2. Start graph node: `docker-compose up`
3. Place ABIs in the `artifacts/` directory
4. In `voltz-core`, start `hardhat`: `npx hardhat node --hostname 0.0.0.0`
5. Create subgraph: `yarn create-local`
6. Deploy subgraph (currently broken): `yarn deploy-local`

## Modifying code

After any change to the `subgraph.yaml`, `schema.graphql`, or any files in the `src/` directory, run:

```
yarn codegen
```

Do not modify any files in the `generated/` directory directly.

## To reset docker

1. Remove containers: `docker-compose down`
2. Remove `data/` directory containing database files
3. Run `docker-compose up`
