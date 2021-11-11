import * as aws from "@pulumi/aws";

const sesPolicy = new aws.iam.Policy("ses-policy", {policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Action: ["logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "ses:SendEmail",
        "ses:SendRawEmail"],
      Effect: "Allow",
      Resource: "*",
    }],
  })});

const hookamonkLambdaRole = new aws.iam.Role("hookamonk-lambda-role", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Action: "sts:AssumeRole",
      Effect: "Allow",
      Sid: "",
      Principal: {
        Service: "lambda.amazonaws.com",
      },
    }],
  }),
  managedPolicyArns: [
    sesPolicy.arn,
  ],
});

export const hookamonkContactFormLambda = new aws.lambda.CallbackFunction(
  "hookamonk-contact-form",
  {
    runtime: aws.lambda.Runtime.NodeJS14dX,
    role: hookamonkLambdaRole,
    async callback(event: any) {
      let body;
      if (event.body !== null && event.body !== undefined) {
        if (event.isBase64Encoded) {
          body = JSON.parse(Buffer.from(event.body, 'base64').toString('utf8'));
        }
      } else {
        body = JSON.parse(event.body);
      }

      const message = `Ahoj,

      Máme tu zájemce z webu. Do formuláře zadal následující informace:

      Má zájem o produkt: ${body.product}
      Jméno: ${body.name}
      Email: ${body.email}
      Telefon: ${body.telephone}
      Zpráva od příjemce: ${body.message}`;

      const ses = new aws.sdk.SES({ region: "eu-west-1" });

      const receivers = ["sales@hookamonk.com", "vaclav.slavik@topmonks.com"];
      const sender = "no-reply@topmonks.com";
      // @ts-ignore
      await ses
        .sendEmail({
          Destination: {
            ToAddresses: receivers
          },
          ReplyToAddresses: [body.email],
          Message: {
            Body: {
              Text: {
                Data: message,
                Charset: "UTF-8"
              }
            },
            Subject: {
              Data: `Hookamonk.com Contact Form: "${body.name}"`,
              Charset: "UTF-8"
            }
          },
          Source: sender
        })
        .promise();

      return {
        statusCode: 202,
        body: "Accepted",
        headers: {
          "Access-Control-Allow-Headers":
            "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Methods": "OPTIONS,POST",
          "Access-Control-Allow-Origin": "*"
        }
      };
    }
  }
);
