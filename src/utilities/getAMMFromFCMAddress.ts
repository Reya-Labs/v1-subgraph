import { AMM, FCM } from '../../generated/schema';

const getAMMFromFCMAddress = (fcmAddress: string): AMM | null => {
  const fcm = FCM.load(fcmAddress);

  if (fcm === null) {
    return null;
  }

  const amm = AMM.load(fcm.amm);

  if (amm !== null) {
    return amm;
  }

  return null;
};

export default getAMMFromFCMAddress;
