const AWS = require("aws-sdk");
const ses = new AWS.SES({
  region: "eu-west-1"
});
const RECEIVERS = ["vaclav.slavik@topmonks.com"];
const SENDER = 'email-signup-form@hookamonk.com';

/** @typedef { import("@pulumi/awsx/apigateway").Request } APIGatewayProxyEvent */
/** @typedef { import("@pulumi/awsx/apigateway").Response } APIGatewayProxyResult */

/**
 * @param {APIGatewayProxyEvent} event
 * @returns {Promise.<APIGatewayProxyResult>}
 */
export const handler = ({ email }, context, callback) => {
  if( !/(.+)@(.+){2,}\.(.+){2,}/.test(email) ){
    context.fail('invalid email');
    return;
  }
  sendEmail(email, function (err, data) {
    let response = {
      "statusCode": 200
    };
    callback(err, response);
  });
}

function sendEmail (email, done) {
  let params = {
    Destination: {
      ToAddresses: RECEIVERS
    },
    ReplyToAddresses: [email],
    Message: {
      Body: {
        Text: {
          Data: 'Someone subscribed to Hookamonk mailing list with email ' + email,
          Charset: 'UTF-8'
        }
      },
      Subject: {
        Data: 'Hookamonk mailing list subscription from ' + email,
        Charset: 'UTF-8'
      }
    },
    Source: SENDER
  };
  ses.sendEmail(params, done);
}
