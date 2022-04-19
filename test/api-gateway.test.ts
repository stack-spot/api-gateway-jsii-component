import { App, Stack } from 'aws-cdk-lib';
import {
  EndpointType,
  LambdaIntegration,
  MethodLoggingLevel,
} from 'aws-cdk-lib/aws-apigateway';
import { Template } from 'aws-cdk-lib/assertions';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { ApiGateway } from '../lib/index';

describe('ApiGateway', () => {
  test('creates a rest api', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    const template = Template.fromStack(stack);

    template.hasResource('AWS::ApiGateway::RestApi', {});
  });

  test('creates only one rest api', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
  });

  test('creates the rest api with api key source in header', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      ApiKeySourceType: 'HEADER',
    });
  });

  test('creates the rest api with default description', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Description: 'TestRestApi REST API.',
    });
  });

  test('creates the rest api with custom description', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiDescription: 'Test REST API description.',
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Description: 'Test REST API description.',
    });
  });

  test('creates the rest api with right endpoint type', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      EndpointConfiguration: { Types: ['PRIVATE'] },
    });
  });

  test('creates the rest api with custom policy', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      policy: `{
        "Version": "2012-10-17",
        "Statement": [
          {
              "Effect": "Allow",
              "Principal": "*",
              "Action": "execute-api:Invoke",
              "Resource": "arn:aws:execute-api:region:account-id:*"
          }
        ]
      }`,
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Policy: {
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Principal: '*',
            Resource: 'arn:aws:execute-api:region:account-id:*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('creates the rest api with right name', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'TestRestApi',
    });
  });

  test('creates the rest api deployment with right description', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Deployment', {
      Description: 'Initial deployment',
    });
  });

  test('creates the rest api deployment with update replace policy as retain', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    const template = Template.fromStack(stack);

    const deployment = template.findResources('AWS::ApiGateway::Deployment');
    const deploymentParameter = Object.keys(deployment)[0];
    const updateReplacePolicy =
      deployment[deploymentParameter].UpdateReplacePolicy;

    expect(updateReplacePolicy).toBe('Retain');
  });

  test('creates the rest api deployment with deletion policy as retain', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    const template = Template.fromStack(stack);

    const deployment = template.findResources('AWS::ApiGateway::Deployment');
    const deploymentParameter = Object.keys(deployment)[0];
    const deletionPolicy = deployment[deploymentParameter].DeletionPolicy;

    expect(deletionPolicy).toBe('Retain');
  });

  test('creates api key in the rest api', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addApiKey({ apiKeyName: 'TestApiKey' });
    const template = Template.fromStack(stack);

    template.hasResource('AWS::ApiGateway::ApiKey', {});
  });

  test('creates any amount of api keys in the rest api', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addApiKey({ apiKeyName: 'TestApiKey1' });
    apiGateway.addApiKey({ apiKeyName: 'TestApiKey2' });
    apiGateway.addApiKey({ apiKeyName: 'TestApiKey3' });
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::ApiGateway::ApiKey', 3);
  });

  test('creates api key always enabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addApiKey({ apiKeyName: 'TestApiKey' });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Enabled: true,
    });
  });

  test('creates api key with right name', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addApiKey({ apiKeyName: 'TestApiKey' });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Name: 'TestApiKey',
    });
  });

  test('creates api key with default description', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addApiKey({ apiKeyName: 'TestApiKey' });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Description: 'The TestApiKey key for TestRestApi REST API.',
    });
  });

  test('creates api key with custom description', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addApiKey({
      apiKeyName: 'TestApiKey',
      apiKeyDescription: 'Test API Key description.',
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Description: 'Test API Key description.',
    });
  });

  test('creates path with kinesis integration', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const kinesisArn: string =
      'arn:aws:kinesis:us-east-1:012345678901:stream/TestKinesisDataStream';
    apiGateway.addIntegrationKinesisDataStream({
      kinesisArn,
      method: 'GET',
      path: '/test/kinesis',
      policy: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "kinesis:PutRecords"
            ],
            "Resource": "${kinesisArn}"
          }
        ]
      }`,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Uri: {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':apigateway:',
              { Ref: 'AWS::Region' },
              ':kinesis:path/arn:aws:kinesis:us-east-1:012345678901:stream/TestKinesisDataStream',
            ],
          ],
        },
      },
    });
  });

  test('creates iam role for kinesis integration to any principal', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const kinesisArn: string =
      'arn:aws:kinesis:us-east-1:012345678901:stream/TestKinesisDataStream';
    apiGateway.addIntegrationKinesisDataStream({
      kinesisArn,
      method: 'GET',
      path: '/test/kinesis',
      policy: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "kinesis:PutRecords"
            ],
            "Resource": "${kinesisArn}"
          }
        ]
      }`,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: { Statement: [{ Principal: { AWS: '*' } }] },
    });
  });

  test('creates iam role for kinesis integration with correct description', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const kinesisArn: string =
      'arn:aws:kinesis:us-east-1:012345678901:stream/TestKinesisDataStream';
    apiGateway.addIntegrationKinesisDataStream({
      kinesisArn,
      method: 'GET',
      path: '/test/kinesis',
      policy: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "kinesis:PutRecords"
            ],
            "Resource": "${kinesisArn}"
          }
        ]
      }`,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::IAM::Role', {
      Description:
        'Role for TestRestApi REST API in /test/kinesis path with GET method.',
    });
  });

  test('creates iam role for kinesis integration with correct policy', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const kinesisArn: string =
      'arn:aws:kinesis:us-east-1:012345678901:stream/TestKinesisDataStream';
    apiGateway.addIntegrationKinesisDataStream({
      kinesisArn,
      method: 'GET',
      path: '/test/kinesis',
      policy: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "kinesis:PutRecords"
            ],
            "Resource": "${kinesisArn}"
          }
        ]
      }`,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::IAM::Role', {
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: 'kinesis:PutRecords',
                Effect: 'Allow',
                Resource:
                  'arn:aws:kinesis:us-east-1:012345678901:stream/TestKinesisDataStream',
              },
            ],
            Version: '2012-10-17',
          },
        },
      ],
    });
  });

  test('creates iam role for kinesis integration with correct name', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const kinesisArn: string =
      'arn:aws:kinesis:us-east-1:012345678901:stream/TestKinesisDataStream';
    apiGateway.addIntegrationKinesisDataStream({
      kinesisArn,
      method: 'GET',
      path: '/test/kinesis',
      policy: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "kinesis:PutRecords"
            ],
            "Resource": "${kinesisArn}"
          }
        ]
      }`,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::IAM::Role', {
      RoleName: 'RestApiTestRestApiGETtestkinesisRole',
    });
  });

  test('creates resources for kinesis integration', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const kinesisArn: string =
      'arn:aws:kinesis:us-east-1:012345678901:stream/TestKinesisDataStream';
    apiGateway.addIntegrationKinesisDataStream({
      kinesisArn,
      method: 'GET',
      path: '/test/kinesis',
      policy: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "kinesis:PutRecords"
            ],
            "Resource": "${kinesisArn}"
          }
        ]
      }`,
    });
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::ApiGateway::Resource', 2);

    template.hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: 'test',
    });

    template.hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: 'kinesis',
    });
  });

  test('creates resources for kinesis integration with corret method', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const kinesisArn: string =
      'arn:aws:kinesis:us-east-1:012345678901:stream/TestKinesisDataStream';
    apiGateway.addIntegrationKinesisDataStream({
      kinesisArn,
      method: 'GET',
      path: '/test/kinesis',
      policy: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "kinesis:PutRecords"
            ],
            "Resource": "${kinesisArn}"
          }
        ]
      }`,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
    });
  });

  test('creates resources for kinesis integration with api key enabled by default', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const kinesisArn: string =
      'arn:aws:kinesis:us-east-1:012345678901:stream/TestKinesisDataStream';
    apiGateway.addIntegrationKinesisDataStream({
      kinesisArn,
      method: 'GET',
      path: '/test/kinesis',
      policy: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "kinesis:PutRecords"
            ],
            "Resource": "${kinesisArn}"
          }
        ]
      }`,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      ApiKeyRequired: true,
    });
  });

  test('creates resources for kinesis integration with api key enabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const kinesisArn: string =
      'arn:aws:kinesis:us-east-1:012345678901:stream/TestKinesisDataStream';
    apiGateway.addIntegrationKinesisDataStream({
      apiKeyRequired: true,
      kinesisArn,
      method: 'GET',
      path: '/test/kinesis',
      policy: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "kinesis:PutRecords"
            ],
            "Resource": "${kinesisArn}"
          }
        ]
      }`,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      ApiKeyRequired: true,
    });
  });

  test('creates resources for kinesis integration with api key disabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const kinesisArn: string =
      'arn:aws:kinesis:us-east-1:012345678901:stream/TestKinesisDataStream';
    apiGateway.addIntegrationKinesisDataStream({
      apiKeyRequired: false,
      kinesisArn,
      method: 'GET',
      path: '/test/kinesis',
      policy: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "kinesis:PutRecords"
            ],
            "Resource": "${kinesisArn}"
          }
        ]
      }`,
    });
    const template = Template.fromStack(stack);

    const method = template.findResources('AWS::ApiGateway::Method');
    const methodParameter = Object.keys(method)[0];
    const properties = method[methodParameter].Properties;

    expect(properties).not.toContain('ApiKeyRequired');
  });

  test('creates resources for kinesis integration with iam authentication disabled by default', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const kinesisArn: string =
      'arn:aws:kinesis:us-east-1:012345678901:stream/TestKinesisDataStream';
    apiGateway.addIntegrationKinesisDataStream({
      kinesisArn,
      method: 'GET',
      path: '/test/kinesis',
      policy: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "kinesis:PutRecords"
            ],
            "Resource": "${kinesisArn}"
          }
        ]
      }`,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      AuthorizationType: 'NONE',
    });
  });

  test('creates resources for kinesis integration with iam authentication enabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const kinesisArn: string =
      'arn:aws:kinesis:us-east-1:012345678901:stream/TestKinesisDataStream';
    apiGateway.addIntegrationKinesisDataStream({
      iamAuthorization: true,
      kinesisArn,
      method: 'GET',
      path: '/test/kinesis',
      policy: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "kinesis:PutRecords"
            ],
            "Resource": "${kinesisArn}"
          }
        ]
      }`,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      AuthorizationType: 'AWS_IAM',
    });
  });

  test('creates resources for kinesis integration with iam authentication disabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const kinesisArn: string =
      'arn:aws:kinesis:us-east-1:012345678901:stream/TestKinesisDataStream';
    apiGateway.addIntegrationKinesisDataStream({
      iamAuthorization: false,
      kinesisArn,
      method: 'GET',
      path: '/test/kinesis',
      policy: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "kinesis:PutRecords"
            ],
            "Resource": "${kinesisArn}"
          }
        ]
      }`,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      AuthorizationType: 'NONE',
    });
  });

  test('creates resources for lambda integration', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const fn = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.addIntegrationLambda({
      fn,
      method: 'GET',
      path: '/test/lambda',
    });
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::ApiGateway::Resource', 2);

    template.hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: 'test',
    });

    template.hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: 'lambda',
    });
  });

  test('creates lambda integration with correct method', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const fn = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.addIntegrationLambda({
      fn,
      method: 'GET',
      path: '/test/lambda',
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
    });
  });

  test('creates lambda integration with api key enabled by default', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const fn = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.addIntegrationLambda({
      fn,
      method: 'GET',
      path: '/test/lambda',
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      ApiKeyRequired: true,
    });
  });

  test('creates lambda integration with api key enabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const fn = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.addIntegrationLambda({
      apiKeyRequired: true,
      fn,
      method: 'GET',
      path: '/test/lambda',
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      ApiKeyRequired: true,
    });
  });

  test('creates lambda integration with api key disabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const fn = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.addIntegrationLambda({
      apiKeyRequired: false,
      fn,
      method: 'GET',
      path: '/test/lambda',
    });
    const template = Template.fromStack(stack);

    const method = template.findResources('AWS::ApiGateway::Method');
    const methodParameter = Object.keys(method)[0];
    const properties = method[methodParameter].Properties;

    expect(properties).not.toContain('ApiKeyRequired');
  });

  test('creates lambda integration with api key disabled by default', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const fn = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.addIntegrationLambda({
      fn,
      method: 'GET',
      path: '/test/lambda',
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      AuthorizationType: 'NONE',
    });
  });

  test('creates lambda integration with api key enabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const fn = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.addIntegrationLambda({
      iamAuthorization: true,
      fn,
      method: 'GET',
      path: '/test/lambda',
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      AuthorizationType: 'AWS_IAM',
    });
  });

  test('creates lambda integration with api key disabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const fn = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.addIntegrationLambda({
      iamAuthorization: false,
      fn,
      method: 'GET',
      path: '/test/lambda',
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      AuthorizationType: 'NONE',
    });
  });

  test('creates stage in the rest api', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ stageName: 'TestStage' });
    const template = Template.fromStack(stack);

    template.hasResource('AWS::ApiGateway::Stage', {});
  });

  test('creates any amount of stages in the rest api', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ stageName: 'TestStage1' });
    apiGateway.addStage({ stageName: 'TestStage2' });
    apiGateway.addStage({ stageName: 'TestStage3' });
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::ApiGateway::Stage', 3);
  });

  test('creates stage with client certificate enabled by default', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ stageName: 'TestStage' });
    const template = Template.fromStack(stack);

    const clientCertificateParameter = Object.keys(
      template.findResources('AWS::ApiGateway::ClientCertificate')
    )[0];

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      ClientCertificateId: {
        'Fn::GetAtt': [clientCertificateParameter, 'ClientCertificateId'],
      },
    });
  });

  test('creates stage with client certificate enabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ clientCertificate: true, stageName: 'TestStage' });
    const template = Template.fromStack(stack);

    const clientCertificateParameter = Object.keys(
      template.findResources('AWS::ApiGateway::ClientCertificate')
    )[0];

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      ClientCertificateId: {
        'Fn::GetAtt': [clientCertificateParameter, 'ClientCertificateId'],
      },
    });
  });

  test('creates stage with client certificate disabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ clientCertificate: false, stageName: 'TestStage' });
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::ApiGateway::ClientCertificate', 0);

    const stage = template.findResources('AWS::ApiGateway::Stage');
    const stageParameter = Object.keys(stage)[0];
    const properties = stage[stageParameter].Properties;

    expect(properties).not.toContain('ClientCertificateId');
  });

  test('creates stage with client certificate with correct description', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ clientCertificate: true, stageName: 'TestStage' });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::ClientCertificate', {
      Description: 'TestRestApi TestStage client certificate',
    });
  });

  test('creates stage with default description', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ stageName: 'TestStage' });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      Description: 'The teststage stage for TestRestApi Rest API.',
    });
  });

  test('creates stage with default logging level', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ stageName: 'TestStage' });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      MethodSettings: [{ LoggingLevel: 'ERROR' }],
    });
  });

  test('creates stage with no logs', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({
      logLevel: MethodLoggingLevel.OFF,
      stageName: 'TestStage',
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      MethodSettings: [{ LoggingLevel: 'OFF' }],
    });
  });

  test('creates stage with custom logging level', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({
      logLevel: MethodLoggingLevel.INFO,
      stageName: 'TestStage',
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      MethodSettings: [{ LoggingLevel: 'INFO' }],
    });
  });

  test('creates stage with metrics disabled by default', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ stageName: 'TestStage' });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      MethodSettings: [{ MetricsEnabled: false }],
    });
  });

  test('creates stage with metrics disabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ metricsEnabled: false, stageName: 'TestStage' });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      MethodSettings: [{ MetricsEnabled: false }],
    });
  });

  test('creates stage with metrics enabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ metricsEnabled: true, stageName: 'TestStage' });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      MethodSettings: [{ MetricsEnabled: true }],
    });
  });

  test('creates stage with right name', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ metricsEnabled: true, stageName: 'TestStage' });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      StageName: 'TestStage',
    });
  });

  test('creates stage with custom throttling burst limit', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ stageName: 'TestStage', throttlingBurstLimit: 100 });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      MethodSettings: [{ ThrottlingBurstLimit: 100 }],
    });
  });

  test('creates stage with custom throttling rate limit', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ stageName: 'TestStage', throttlingRateLimit: 50 });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      MethodSettings: [{ ThrottlingRateLimit: 50 }],
    });
  });

  test('creates stage with tracing disabled by default', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ stageName: 'TestStage' });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      TracingEnabled: false,
    });
  });

  test('creates stage with tracing disabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ stageName: 'TestStage', tracingEnabled: false });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      TracingEnabled: false,
    });
  });

  test('creates stage with tracing enabled', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const apiGateway = new ApiGateway(stack, 'TestConstruct', {
      endpointTypes: [EndpointType.PRIVATE],
      restApiName: 'TestRestApi',
    });
    const handler = new Function(stack, 'TestFunction', {
      code: Code.fromInline(`exports.handler = async (event: any) => {
        JSON.stringify(event, null, 2);
      };`),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
    });
    apiGateway.restApi.root.addMethod('GET', new LambdaIntegration(handler));
    apiGateway.addStage({ stageName: 'TestStage', tracingEnabled: true });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      TracingEnabled: true,
    });
  });
});
