import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SwnApiGateway } from './apigateway';
import { SwnDatabase } from './database';
import { SwnEventBus } from './eventBus';
import { SwnMicroservices } from './microservices';
import { SwnQueue } from './queue';

export class AwsMicroservicesStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const database = new SwnDatabase(this, 'Database');

        const microservices = new SwnMicroservices(this, 'Microservices', {
            productTable: database.productTable,
            basketTable: database.basketTable,
            orderTable: database.orderTable
        });
        const apiGateway = new SwnApiGateway(this, 'ApiGateway', {
            productMicroservice: microservices.productMicroservice,
            basketMicroservice: microservices.basketMicroservice,
            orderMicroservice: microservices.orderMicroservice
        });

        const queue = new SwnQueue(this, 'Queue', {
            consumer: microservices.orderMicroservice
        });

        const eventBus = new SwnEventBus(this, 'EventBus', {
            publisherFunction: microservices.basketMicroservice,
            targetQueue: queue.orderQueue
            // targetFunction: microservices.orderMicroservice
        });
    }
}
