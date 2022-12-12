import { handleEPNSNotification } from '../mappings/notifications/handleEPNSNotification';

const sendPushNotification = (
  recipient: string,
  type: string,
  title: string,
  body: string,
  subject: string,
  message: string,
  image: string,
  secret: string,
  cta: string,
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

  handleEPNSNotification(recipient, notification);
};

export default sendPushNotification;
