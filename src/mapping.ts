// // Note: EPNS only supports The Graph Hosted Service at present
// import { sendEPNSNotification } from './EPNSNotification';
// import { PositionLiquidation } from './templates/MarginEngine/MarginEngine';

export const subgraphID = 'voltzprotocol/voltz-goerli'; // change to mainnet when deploying to mainnet subgraph

// function handleLiquidationAlert(event: PositionLiquidation): void {
//   const recipient = event.params.owner.toString(); // somehow get the address of the liquidated person here
//   const type = '3'; // only send it to a specific person
//   const title = 'Liquidation Event Alert';
//   const body = `The address ${event.params.owner} has been liquidated. \n
//   The amount of notional unwound was ${event.params.notionalUnwound}. \n
//   The lower tick and upper tick were ${event.params.tickLower} and ${event.params.tickUpper}, respectively. \n
//   `; // how can I also add the pool where the liquidation happened to this?
//   const subject = `Liquidation of ${event.params.owner}`;
//   const message = `Please check your portfolio as one of your positions was liquidated`;
//   const image = '';
//   const secret = 'null';
//   const cta = 'https://app.voltz.xyz/';

//   const notification = `{
//       "type": "${type}",
//       "title": "${title}",
//       "body": "${body}",
//       "subject": "${subject}",
//       "message": "${message}",
//       "image": "${image}",
//       "secret": "${secret}",
//       "cta": "${cta}"
//   }`;

//   sendEPNSNotification(recipient, notification);
// }

// export default handleLiquidationAlert;
