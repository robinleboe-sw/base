/**
 * Email templates for transactional system emails
 */

import { Accounts } from 'meteor/accounts-base';

const name = 'Sessionwire Studio';
const email = '<support@sessionwire.com>';
const from = `${name} ${email}`;
const emailTemplates = Accounts.emailTemplates;

emailTemplates.siteName = name;
emailTemplates.from = from;

emailTemplates.resetPassword = {
  subject() {
    return `[${name}] Reset Your Sessionwire Studio Password`;
  },
  text(user, url) {
    const userEmail = user.emails[0].address;
    const urlWithoutHash = url.replace('#/', '');

    return `A password reset has been requested for the Sessionwire Studio account related to this
    address (${userEmail}). To reset the password, visit the following link:
    \n\n${urlWithoutHash}\n\n If you did not request this reset, please ignore
    this email. If you feel something is wrong, please contact our support team:
    ${email}.`;
  },
};
