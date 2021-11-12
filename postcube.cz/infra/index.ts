import * as awsx from "@pulumi/awsx";
import { postcubeContactFormLambda } from "../lambdas/contact-form";

export const api = new awsx.apigateway.API("postcube-api", {
  stageName: "v1",
  restApiArgs: {
    description: "Postcube API"
  },
  routes: [
    {
      path: "/contact-form",
      method: "POST",
      eventHandler: postcubeContactFormLambda,
    },
  ]
});
