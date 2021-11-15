import * as awsx from "@pulumi/awsx";
import { startupStudioContactFormLambda } from "../lambdas/contact-form";

export const api = new awsx.apigateway.API("topmonks-webs-api", {
  stageName: "v1",
  restApiArgs: {
    description: "Topmonks webs API"
  },
  routes: [
    {
      path: "/startup-studio-contact-form",
      method: "POST",
      eventHandler: startupStudioContactFormLambda,
    },
  ]
});
