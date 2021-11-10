import * as aws from "@pulumi/aws";
import { URLSearchParams } from "url";

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
    async callback(event: any, context) {
      console.log(event.body);
      const data = new URLSearchParams(event.body);
      const message = `Ahoj,

      Máme tu zájemce z webu. ${data.get("name")} ${data.get("email")}.
      Měli bychom se mu ozvat. Slíbili jsme to.`;

      const ses = new aws.sdk.SES({ region: "eu-west-1" });

      const receivers = ["vaclav.slavik@topmonks.com"];
      const sender = "no-reply@topmonks.com";
      // @ts-ignore
      await ses
        .sendEmail({
          Destination: {
            ToAddresses: receivers
          },
          ReplyToAddresses: [data.get("email")],
          Message: {
            Body: {
              Text: {
                Data: message,
                Charset: "UTF-8"
              }
            },
            Subject: {
              Data: `Hookamonk.com Contact Form: "${data.get("name")}"`,
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
