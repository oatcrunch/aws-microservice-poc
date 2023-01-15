import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { SqsQueue } from 'aws-cdk-lib/aws-events-targets';
import { IQueue } from 'aws-cdk-lib/aws-sqs';

interface SwnEventBusProps {
    publisherFunction: IFunction;
    // targetFunction: IFunction;
    targetQueue: IQueue
}

export class SwnEventBus extends Construct {
    constructor(scope: Construct, id: string, props: SwnEventBusProps) {
        super(scope, id);

        const bus = new EventBus(this, 'SwnEventBus', {
            eventBusName: 'SwnEventBus'
        });

        const checkoutBasketRule = new Rule(this, 'CheckoutBasketRule', {
            eventBus: bus,
            enabled: true,
            description: 'When Basket microservice checkout the basket',
            eventPattern: {
                source: ['com.swn.basket.checkoutbasket'],
                detailType: ['CheckoutBasket']
            },
            ruleName: 'CheckoutBasketRule'
        });

        // subscriber as the target
        // checkoutBasketRule.addTarget(new LambdaFunction(props.targetFunction));

        checkoutBasketRule.addTarget(new SqsQueue(props.targetQueue));

        // grant publisher to PUT events to event bus
        bus.grantPutEventsTo(props.publisherFunction);  // prevent AccessDeniedException
    }
}
