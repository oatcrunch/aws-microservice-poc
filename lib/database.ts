import { RemovalPolicy } from 'aws-cdk-lib';
import {
    AttributeType,
    BillingMode,
    ITable,
    Table
} from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class SwnDatabase extends Construct {
    public readonly productTable: ITable;
    public readonly basketTable: ITable;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.productTable = this.createProductTable();
        // this.productTable = productTable;
        this.basketTable = this.createBasketTable();
        // this.basketTable = basketTable;
    }

    private createBasketTable(): ITable {
        return new Table(this, 'basket', {
            partitionKey: {
                name: 'userName',
                type: AttributeType.STRING
            },
            tableName: 'basket',
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
        });
    }

    private createProductTable(): ITable {
        return new Table(this, 'product', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            tableName: 'Product',
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
        });
    }
}
