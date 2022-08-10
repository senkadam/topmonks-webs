import * as aws from "@pulumi/aws";

const sesPolicy = new aws.iam.Policy("ses-policy", {policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Action: ["logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "ses:SendEmail",
        "ses:SendRawEmail",
        "ses:SendTemplatedEmail"],
      Effect: "Allow",
      Resource: "*",
    }],
  })
});

export const contactFormLambdaRole = new aws.iam.Role("contact-form-lambda-role", {
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
