import { BigInt, log } from '@graphprotocol/graph-ts';
import { EpnsNotificationCounter, EpnsPushNotification } from '../generated/schema';
import { subgraphID } from './mapping'; // Should this change to the handleLiquidatePosition.ts path?

export function sendEPNSNotification(recipient: string, notification: string): void {
  const id1 = subgraphID;
  log.info('New id of EpnsNotificationCounter is: {}', [id1]);

  let epnsNotificationCounter = EpnsNotificationCounter.load(id1);
  if (epnsNotificationCounter == null) {
    epnsNotificationCounter = new EpnsNotificationCounter(id1);
    epnsNotificationCounter.totalCount = BigInt.fromI32(0);
  }
  epnsNotificationCounter.totalCount = epnsNotificationCounter.totalCount.plus(BigInt.fromI32(1));

  const count = epnsNotificationCounter.totalCount.toHexString();
  const id2 = `${subgraphID}+${count}`;
  log.info('New id of EpnsPushNotification is: {}', [id2]);

  let epnsPushNotification = EpnsPushNotification.load(id2);
  if (epnsPushNotification == null) {
    epnsPushNotification = new EpnsPushNotification(id2);
  }

  epnsPushNotification.recipient = recipient;
  epnsPushNotification.notification = notification;
  epnsPushNotification.notificationNumber = epnsNotificationCounter.totalCount;

  epnsPushNotification.save();
  epnsNotificationCounter.save();
}