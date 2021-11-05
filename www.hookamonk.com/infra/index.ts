import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as lambdaBuilder from "../../lambda-builder";
import * as path from "path";
import { CustomDomainDistribution } from "@topmonks/pulumi-aws/apigateway";

const codeAsset = (fileName: string) =>
  lambdaBuilder.buildCodeAsset(path.join(__dirname, "..", "lambdas", fileName));

const defaultLambdaRole = new aws.iam.Role("hookamonk-default-lambda-role", {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal(
    aws.iam.Principals.LambdaPrincipal
  )
});

new aws.iam.RolePolicyAttachment(
  "hookamonk-lambda-basic-execution-attachment",
  {
    policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
    role: defaultLambdaRole
  }
);

export const api = new awsx.apigateway.API("hookamonk-api", {
  stageName: "v1",
  restApiArgs: {
    description: "Hookamonk API"
  },
  routes: [
    {
      path: "/contact-form",
      method: "GET",
      eventHandler: new aws.lambda.Function("hookamonk-contact-form", {
        publish: true,
        runtime: aws.lambda.Runtime.NodeJS14dX,
        role: defaultLambdaRole.arn,
        handler: "index.handler",
        code: codeAsset("hookamonk/index.js")
      })
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
