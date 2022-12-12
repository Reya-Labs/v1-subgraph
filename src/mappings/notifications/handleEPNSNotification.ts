import { BigInt, log } from '@graphprotocol/graph-ts';
import { EpnsNotificationCounter, EpnsPushNotification } from '../../../generated/schema';
import { NOTIFICATION_CONFIGS } from '../../constants';

export function handleEPNSNotification(recipient: string, notification: string): void {
  const id1 = NOTIFICATION_CONFIGS.goerli.subgraphID;
  log.info('New id of EpnsNotificationCounter is: {}', [id1]);

  let epnsNotificationCounter = EpnsNotificationCounter.load(id1);
  if (epnsNotificationCounter == null) {
    epnsNotificationCounter = new EpnsNotificationCounter(id1);
    epnsNotificationCounter.totalCount = BigInt.fromI32(0);
  }
  epnsNotificationCounter.totalCount = epnsNotificationCounter.totalCount.plus(BigInt.fromI32(1));

  const count = epnsNotificationCounter.totalCount.toHexString();
  const id2 = `${NOTIFICATION_CONFIGS.goerli.subgraphID}+${count}`;
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

export default handleEPNSNotification;
