import { sendEPNSNotification } from '../mappings/notifications/EPNSNotification';

const sendPushNotification = (
  recipient: string,
  type: string,
  title: string,
  body: string,
  subject: string,
  message: string,
  image = '',
  secret = 'null',
  cta = 'https://app.voltz.xyz/',
): void => {
  const notification = `{
      "type": "${type}", 
      "title": "${title}",
      "body": "${body}",
      "subject": "${subject}",
      "message": "${message}",
      "image": "${image}",
      "secret": "${secret}",
      "cta": "${cta}"
  }`;

  sendEPNSNotification(recipient, notification);
};

export default sendPushNotification;
