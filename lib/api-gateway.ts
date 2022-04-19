import {
  ApiKey,
  ApiKeySourceType,
  AuthorizationType,
  AwsIntegration,
  CfnClientCertificate,
  CorsOptions,
  Deployment,
  EndpointType,
  MethodLoggingLevel,
  RestApi,
  Stage,
} from 'aws-cdk-lib/aws-apigateway';
import { AnyPrincipal, PolicyDocument, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

/**
 * ApiGateway construct props.
 */
export interface ApiGatewayProps {
  /**
   * The CORS options for the REST API.
   */
  readonly cors?: CorsOptions;

  /**
   * The endpoint types of a REST API.
   */
  readonly endpointTypes: EndpointType[];

  /**
   * A policy document that contains the permissions for the REST API.
   */
  readonly policy?: string;

  /**
   * A description for the API Gateway RestApi resource.
   */
  readonly restApiDescription?: string;

  /**
   * A name for the API Gateway RestApi resource.
   */
  readonly restApiName: string;
}

/**
 * API key props.
 */
export interface ApiKeyProps {
  /**
   * The description of the API key.
   */
  readonly apiKeyDescription?: string;

  /**
   * The name of the API key.
   */
  readonly apiKeyName: string;
}

/**
 * Kinesis integration props.
 */
export interface KinesisDataStreamIntegrationProps {
  /**
   * Indicates whether the method requires clients to submit a valid API key.
   *
   * @default true
   */
  readonly apiKeyRequired?: boolean;

  /**
   * Represents whether to use IAM authentication or not.
   *
   * @default false
   */
  readonly iamAuthorization?: boolean;

  /**
   * The ARN of the Kinesis for the integration.
   */
  readonly kinesisArn: string;

  /**
   * The method for the resource (path).
   */
  readonly method: string;

  /**
   * The path for the integration.
   */
  readonly path: string;

  /**
   * The policy for the integration.
   */
  readonly policy: string;
}

/**
 * Stages props.
 */
export interface StageProps {
  /**
   * The client certificate for the stage.
   *
   * @default true
   */
  readonly clientCertificate?: boolean;

  /**
   * The log level of the stage.
   *
   * @default MethodLoggingLevel.ERROR
   */
  readonly logLevel?: MethodLoggingLevel;

  /**
   * Specifies whether Amazon CloudWatch metrics are enabled.
   *
   * @default false
   */
  readonly metricsEnabled?: boolean;

  /**
   * The name of the stage.
   */
  readonly stageName: string;

  /**
   * Specifies the throttling burst limit.
   */
  readonly throttlingBurstLimit?: number;

  /**
   * Specifies the throttling rate limit.
   */
  readonly throttlingRateLimit?: number;

  /**
   * Specifies whether Amazon X-Ray tracing is enabled.
   *
   * @default false
   */
  readonly tracingEnabled?: boolean;
}

/**
 * Component to manage an API Gateway.
 */
export class ApiGateway extends Construct {
  /**
   * The initial deployment of the REST API.
   */
  public readonly deployment: Deployment;

  /**
   * Represents a REST API in Amazon API Gateway.
   */
  public readonly restApi: RestApi;

  /**
   * Creates a new instance of class ApiGateway.
   *
   * @param {Construct} scope The construct within which this construct is defined.
   * @param {string} id Identifier to be used in AWS CloudFormation.
   * @param {ApiGatewayProps} [props={}] Parameters of the class ApiGateway.
   * @see {@link https://docs.aws.amazon.com/cdk/v2/guide/constructs.html#constructs_init|AWS CDK Constructs}
   */
  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    this.restApi = new RestApi(this, `RestApi${props.restApiName}`, {
      apiKeySourceType: ApiKeySourceType.HEADER,
      defaultCorsPreflightOptions: props.cors,
      deploy: false,
      description: props.restApiDescription || `${props.restApiName} REST API.`,
      endpointTypes: props.endpointTypes,
      policy:
        typeof props.policy === 'string'
          ? PolicyDocument.fromJson(JSON.parse(props.policy))
          : undefined,
      restApiName: props.restApiName,
      retainDeployments: true,
    });

    this.deployment = new Deployment(
      this,
      `RestApi${props.restApiName}Deployment`,
      {
        api: this.restApi,
        description: 'Initial deployment',
        retainDeployments: true,
      }
    );
  }

  /**
   * Add a API key in AWS API Gateway.
   *
   * @param {ApiKeyProps} props The props of the API key.
   * @returns {ApiKey} The API key to create.
   */
  public addApiKey(props: ApiKeyProps): ApiKey {
    return new ApiKey(
      this,
      `RestApi${this.restApi.restApiName}ApiKey${props.apiKeyName}`,
      {
        apiKeyName: props.apiKeyName,
        description:
          props.apiKeyDescription ||
          `The ${props.apiKeyName} key for ${this.restApi.restApiName} REST API.`,
      }
    );
  }

  /**
   * Add Kinesis Data Stream integration to the REST API.
   *
   * @param {KinesisDataStreamIntegrationProps} props The props for Kinesis Data Stream integration.
   */
  public addIntegrationKinesisDataStream(
    props: KinesisDataStreamIntegrationProps
  ): void {
    const credentialsRole = new Role(
      this,
      `RestApi${this.restApi.restApiName}RoleKinesisDataStream${
        props.method + props.path
      }`,
      {
        assumedBy: new AnyPrincipal(),
        description: `Role for ${this.restApi.restApiName} REST API in ${props.path} path with ${props.method} method.`,
        inlinePolicies: {
          DefaultPoliy: PolicyDocument.fromJson(JSON.parse(props.policy)),
        },
        roleName: `RestApi${
          this.restApi.restApiName +
          props.method +
          props.path.replace(/\//g, '')
        }Role`,
      }
    );

    const resource = this.restApi.root.resourceForPath(props.path);

    resource.addMethod(
      props.method,
      new AwsIntegration({
        options: { credentialsRole },
        path: props.kinesisArn,
        service: 'kinesis',
      }),
      {
        apiKeyRequired:
          typeof props.apiKeyRequired === 'boolean'
            ? props.apiKeyRequired
            : true,
        authorizationType: props.iamAuthorization
          ? AuthorizationType.IAM
          : AuthorizationType.NONE,
        methodResponses: [{ statusCode: '204' }],
      }
    );
  }

  /**
   * Add a stage to the REST API.
   *
   * @param {StageProps} props The props of the stage.
   * @returns {Stage} The stage to create.
   */
  public addStage(props: StageProps): Stage {
    let clientCertificateId: string | undefined;

    const clientCertificate =
      typeof props.clientCertificate === 'boolean'
        ? props.clientCertificate
        : true;

    if (clientCertificate) {
      const cfnClientCertificate = new CfnClientCertificate(
        this,
        `RestApi${this.restApi.restApiName}Stage${props.stageName}Certificate`,
        {
          description: `${this.restApi.restApiName} ${props.stageName} client certificate`,
        }
      );

      clientCertificateId = cfnClientCertificate.attrClientCertificateId;
    }

    return new Stage(
      this,
      `RestApi${this.restApi.restApiName}Stage${props.stageName}`,
      {
        clientCertificateId,
        deployment: this.deployment,
        description: `The ${props.stageName.toLowerCase()} stage for ${
          this.restApi.restApiName
        } Rest API.`,
        loggingLevel: props.logLevel || MethodLoggingLevel.ERROR,
        metricsEnabled:
          typeof props.metricsEnabled === 'boolean'
            ? props.metricsEnabled
            : false,
        stageName: props.stageName,
        throttlingBurstLimit: props.throttlingBurstLimit,
        throttlingRateLimit: props.throttlingRateLimit,
        tracingEnabled:
          typeof props.tracingEnabled === 'boolean'
            ? props.tracingEnabled
            : false,
      }
    );
  }
}
