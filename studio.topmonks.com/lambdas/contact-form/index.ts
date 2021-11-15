import * as aws from "@pulumi/aws";
import { sesPolicy } from "../../../www.hookamonk.com/lambdas/contact-form";

const ssLambdaRole = new aws.iam.Role("topmonks-webs-contact-form-lambda-role", {
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

export const startupStudioContactFormLambda = new aws.lambda.CallbackFunction(
  "startup-studio-contact-form",
  {
    runtime: aws.lambda.Runtime.NodeJS14dX,
    role: ssLambdaRole,
    async callback(event: any) {
      let body;
      if (event.body !== null && event.body !== undefined) {
        if (event.isBase64Encoded) {
          body = JSON.parse(Buffer.from(event.body, 'base64').toString('utf8'));
        }
      } else {
        body = JSON.parse(event.body);
      }

      let message = `Projekt ${body.projectName} má zájem o pitch!

      Popis projektu: ${body.projectDescription}.
      Email: ${body.email}.
      Tel: ${body.Tel}.
      `;

      const ses = new aws.sdk.SES({ region: "eu-west-1" });

      const receivers = ["studio@topmonks.com", "vaclav.slavik@topmonks.com"];
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
              Data: `Startup Studio Contact Form: Projekt ${body.projectName} má zájem o pitch!`,
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
