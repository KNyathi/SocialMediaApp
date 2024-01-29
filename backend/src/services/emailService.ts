import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { error } from 'console';
require('dotenv').config()

const ses = new SESClient({});

function createSendEmailCommand(toAddress: string, fromAddress: string) {
   return new SendEmailCommand ({
      Destination: {
        ToAddresses: [toAddress],
      },
      Source: fromAddress,
      Message: {
        Subject: {
          CharSet: 'UTF-8',
          Data: "Your one-time password"
        },
        Body: {
          Text: {
            CharSet: 'UTF-8',
            Data: message
          },
        },
        
      }
   })
}

export async function sendEmailToken(email: string, token: string) {
   console.log('email: ', email, token);
   const message = `Your one time password: ${token}` 
   const command = createSendEmailCommand(email, "khayelihlenyathi07@gmail.com", message);

   try {
     return await ses.send(command);
   } catch (e) {
     console.log('Error sending email', e);
     return error;
   }
}

sendEmailToken('khayelihlenyathi07@gmail.com', '123');
