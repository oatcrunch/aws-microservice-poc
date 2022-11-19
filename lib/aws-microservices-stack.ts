import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { join } from 'path';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

export class AwsMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productTable = new Table(this, 'product', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: 'Product',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk'
        ]
      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMOD_DB_TABLE_NAME: productTable.tableName 
      },
      runtime: Runtime.NODEJS_14_X
    };

    const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, '/../src/product/index.js'),
      ...nodeJsFunctionProps
    })

    productTable.grantReadWriteData(productFunction);

    // Product microservices api gateway
    // product
    // GET /product
    // POST /pdocut

    // Single product with id parameter
    // GET /product/{id}
    // PUT /product/{id}
    // DELETE /product/{id}

    const apiGateway = new LambdaRestApi(this, 'productApi', {
      restApiName: 'productService',
      handler: productFunction,
      proxy: false
    });

    const product = apiGateway.root.addResource('product');
    product.addMethod('GET'); // GET /product
    product.addMethod('POST');//  POST /product

    const singleProduct = product.addResource('{id}');  // /product/{id}
    singleProduct.addMethod('GET'); //  GET /product/{id}
    singleProduct.addMethod('PUT'); //  PUT /product/{id}
    singleProduct.addMethod('DELETE'); //  DELETE /product/{id}
  }
}
