import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SwnApiGateway } from './apigateway';
import { SwnDatabase } from './database';
import { SwnMicroservices } from './microservices';

export class AwsMicroservicesStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const database = new SwnDatabase(this, 'Database');

        const microservices = new SwnMicroservices(this, 'Microservices', {
            productTable: database.productTable,
            basketTable: database.basketTable
        });
        const apiGateway = new SwnApiGateway(this, 'ApiGateway', {
            productMicroservice: microservices.productMicroservice,
            basketMicroservice: microservices.basketMicroservice
        });
    }
}
