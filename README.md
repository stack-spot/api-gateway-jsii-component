# Api Gateway

[![aws-cdk][badge-aws-cdk]][aws-cdk]
[![jsii][badge-jsii]][jsii]
[![npm-version][badge-npm-version]][npm-package]
[![nuget-version][badge-nuget-version]][nuget-package]
[![npm-downloads][badge-npm-downloads]][npm-package]
[![nuget-downloads][badge-nuget-downloads]][nuget-package]
[![license][badge-license]][license]

Component to manage an API Gateway.

## How to use

Below are all languages supported by the AWS CDK.

### C#

Install the dependency:

```sh
dotnet add package StackSpot.Cdk.ApiGateway
```

Import the construct into your project, for example:

```csharp
using Amazon.CDK;
using Amazon.CDK.AWS.APIGateway;
using Constructs;
using StackSpot.Cdk.ApiGateway;

namespace MyStack
{
    public class MyStack : Stack
    {
        internal MyStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            EndpointType[] endpointTypes = new EndpointType[1] { EndpointType.EDGE };

            new ApiGateway(this, "MyApiGateway", new ApiGatewayProps{
                EndpointTypes = endpointTypes,
                RestApiName = "MyRestApi"
            });
        }
    }
}
```

### F#

Not yet supported.

### Go

Not yet supported.

### Java

Not yet supported.

### JavaScript

Install the dependency:

```sh
npm install --save @stackspot/cdk-api-gateway
```

Import the construct into your project, for example:

```javascript
const { Stack } = require('aws-cdk-lib');
const { EndpointType } = require('aws-cdk-lib/aws-apigateway');
const { ApiGateway } = require('@stackspot/cdk-api-gateway');

class MyStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    new ApiGateway(this, 'MyApiGateway', {
      endpointTypes: [EndpointType.EDGE],
      restApiName: 'MyRestApi',
    });
  }
}

module.exports = { MyStack };
```

### Python

Not yet supported.

### TypeScript

Install the dependency:

```sh
npm install --save @stackspot/cdk-api-gateway
```

Import the construct into your project, for example:

```typescript
import { Stack, StackProps } from 'aws-cdk-lib';
import { EndpointType } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { ApiGateway } from '@stackspot/cdk-api-gateway';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new ApiGateway(this, 'MyApiGateway', {
      endpointTypes: [EndpointType.EDGE],
      restApiName: 'MyRestApi',
    });
  }
}
```

## Construct Props

| Name                | Type                                                 | Description                                                       |
| ------------------- | ---------------------------------------------------- | ----------------------------------------------------------------- |
| cors?               | [CorsOptions][aws-cdk-apigateway-cors-options]       | The CORS options for the REST API.                                |
| endpointTypes       | [EndpointType\[\]][aws-cdk-apigateway-endpoint-type] | The endpoint types of a REST API.                                 |
| policy?             | string                                               | A policy document that contains the permissions for the REST API. |
| restApiDescription? | string                                               | A description for the API Gateway RestApi resource.               |
| restApiName         | string                                               | A name for the API Gateway RestApi resource.                      |

## Another Props

### ApiKeyProps

| Name               | Type   | Description                     |
| ------------------ | ------ | ------------------------------- |
| apiKeyDescription? | string | The description of the API key. |
| apiKeyName         | string | The name of the API key.        |

### StageProps

| Name                  | Type                                                          | Description                                                              |
| --------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| logLevel?             | [MethodLoggingLevel][aws-cdk-apigateway-method-logging-level] | The log level of the stage. Default: MethodLoggingLevel.ERROR.           |
| metricsEnabled?       | boolean                                                       | Specifies whether Amazon CloudWatch metrics are enabled. Default: false. |
| stageName             | string                                                        | The name of the stage.                                                   |
| throttlingBurstLimit? | number                                                        | Specifies the throttling burst limit.                                    |
| throttlingRateLimit?  | number                                                        | Specifies the throttling rate limit.                                     |
| tracingEnabled?       | boolean                                                       | Specifies whether Amazon X-Ray tracing is enabled. Default: false.       |

## Properties

| Name       | Type                                        | Description                                  |
| ---------- | ------------------------------------------- | -------------------------------------------- |
| deployment | [Deployment][aws-cdk-apigateway-deployment] | The initial deployment of the REST API.      |
| restApi    | [RestApi][aws-cdk-apigateway-rest-api]      | Represents a REST API in Amazon API Gateway. |

## Methods

| Name             | Description                       |
| ---------------- | --------------------------------- |
| addApiKey(props) | Add a API key in AWS API Gateway. |
| addStage(props)  | Add a stage to the REST API.      |

### addApiKey(props)

```typescript
public addApiKey(props: ApiKeyProps): ApiKey
```

_Parameters_

- **props** [ApiKeyProps](#apikeyprops)

_Returns_

- [ApiKey][aws-cdk-apigateway-api-key]

Add a API key in AWS API Gateway.

You can use this method to add as many API keys as you like.

### addStage(props)

```typescript
public addStage(props: StageProps): Stage
```

_Parameters_

- **props** [StageProps](#stageprops)

_Returns_

- [Stage][aws-cdk-apigateway-stage]

Add a stage to the REST API.

You can use this method to add as many stages as you like.

## IAM Least privilege

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "apigateway:DELETE",
        "apigateway:GET",
        "apigateway:PATCH",
        "apigateway:POST",
        "apigateway:PUT",
        "apigateway:UpdateRestApiPolicy",
        "iam:AttachRolePolicy",
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:DetachRolePolicy",
        "iam:GetRole",
        "iam:PassRole",
        "ssm:GetParameters"
      ],
      "Resource": "*"
    }
  ]
}
```

## Development

### Prerequisites

- [EditorConfig][editorconfig] (Optional)
- [Git][git]
- [Node.js][nodejs] 17

### Setup

```sh
cd api-gateway-jsii-component
npm install
```

[aws-cdk]: https://aws.amazon.com/cdk
[aws-cdk-apigateway-api-key]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.ApiKey.html
[aws-cdk-apigateway-cors-options]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.CorsOptions.html
[aws-cdk-apigateway-deployment]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.Deployment.html
[aws-cdk-apigateway-endpoint-type]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.EndpointType.html
[aws-cdk-apigateway-method-logging-level]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.MethodLoggingLevel.html
[aws-cdk-apigateway-rest-api]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.RestApi.html
[aws-cdk-apigateway-stage]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.Stage.html
[badge-aws-cdk]: https://img.shields.io/github/package-json/dependency-version/stack-spot/api-gateway-jsii-component/dev/aws-cdk-lib
[badge-jsii]: https://img.shields.io/github/package-json/dependency-version/stack-spot/api-gateway-jsii-component/dev/jsii
[badge-license]: https://img.shields.io/github/license/stack-spot/api-gateway-jsii-component
[badge-npm-downloads]: https://img.shields.io/npm/dt/@stackspot/cdk-api-gateway?label=downloads%20%28npm%29
[badge-npm-version]: https://img.shields.io/npm/v/@stackspot/cdk-api-gateway
[badge-nuget-downloads]: https://img.shields.io/nuget/dt/StackSpot.Cdk.ApiGateway?label=downloads%20%28NuGet%29
[badge-nuget-version]: https://img.shields.io/nuget/vpre/StackSpot.Cdk.ApiGateway
[editorconfig]: https://editorconfig.org/
[git]: https://git-scm.com/downloads
[jsii]: https://aws.github.io/jsii
[license]: https://github.com/stack-spot/api-gateway-jsii-component/blob/main/LICENSE
[nodejs]: https://nodejs.org/download
[npm-package]: https://www.npmjs.com/package/@stackspot/cdk-api-gateway
[nuget-package]: https://www.nuget.org/packages/StackSpot.Cdk.ApiGateway
