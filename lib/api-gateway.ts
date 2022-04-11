import {
  ApiKey,
  ApiKeySourceType,
  CorsOptions,
  Deployment,
  EndpointType,
  MethodLoggingLevel,
  RestApi,
  Stage,
} from 'aws-cdk-lib/aws-apigateway';
import { PolicyDocument } from 'aws-cdk-lib/aws-iam';
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
 * Stages props.
 */
export interface StageProps {
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
   * Add a stage to the REST API.
   *
   * @param {StageProps} props The props of the stage.
   * @returns {Stage} The stage to create.
   */
  public addStage(props: StageProps): Stage {
    return new Stage(
      this,
      `RestApi${this.restApi.restApiName}Stage${props.stageName}`,
      {
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
