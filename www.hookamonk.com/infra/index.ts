import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { CustomDomainDistribution } from "@topmonks/pulumi-aws/apigateway";
import { hookamonkContactFormLambda } from "../lambdas/contact-form";

// @ts-ignore
export const defaultLambdaRole = aws.iam.getRoleOutput({
  name: "lambda_ses",
});

export const api = new awsx.apigateway.API("hookamonk-api", {
  stageName: "v1",
  restApiArgs: {
    description: "Hookamonk API"
  },
  routes: [
    {
      path: "/contact-form",
      method: "POST",
      eventHandler: hookamonkContactFormLambda,
    },
  ]
});

export const apiDistribution = new CustomDomainDistribution(
  "hookamonk-api",
  {
    gateway: api,
    domainName: "hookamonk-api.monks.cloud",
    basePath: "v1"
  },
  { dependsOn: [api] }
);
