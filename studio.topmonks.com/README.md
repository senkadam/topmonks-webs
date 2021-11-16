# Contact form service guide

Few of our websites (namely www.hookamonk.com, [postcube.cz](https://postcube.cz)  and [studio.topmonks.com](https://studio.topmonks.com) at the time of creation) have a contact form feature. It's infrastructure is manged via Pulumi IaC code. Bellow, you can find step-by-step how-to guide that creates all the infrastructure to create AWS api gateway, lambda, roles and policies and how to utilize those resources from the website to provide contact form functionality.

## How to

We will use studio.topmonks.com site as a blueprint. In order to make everything work, we had to:

1. Create api gateway - [infra/index.ts](infra/index.ts)
2. Create lambda that will serve our api endpoint [lambdas/contact-form/index.ts](lambdas/contact-form/index.ts)
3. Include the code in the root [index.ts](./index.ts)
4. In the ideal world, pushing the code to repo would be enough, but if the provision CircleCI job is failing (as it was in the time of writing this guide), you will have to run `pulumi up` and deploy the changes to aws manually.
5. Implement the code to invoke the newly created API endpoint from website [src/html/index.njk](src/html/index.njk)

As the infrastructure is managed via Pulumi, to delete all AWS resources, all is needed is to delete the resources created in steps 1, 2 and 3.
