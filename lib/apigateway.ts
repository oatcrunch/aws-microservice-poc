import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface SwnApiGatewayProps {
    productMicroservice: IFunction;
    basketMicroservice: IFunction;
}

export class SwnApiGateway extends Construct {
    constructor(scope: Construct, id: string, props: SwnApiGatewayProps) {
        super(scope, id);

        this.createProductApi(props.productMicroservice);
        this.createBasketApi(props.basketMicroservice);
    }

    private createProductApi(productMicroservice: IFunction) {
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
            handler: productMicroservice,
            proxy: false
        });

        const product = apiGateway.root.addResource('product');
        product.addMethod('GET'); // GET /product
        product.addMethod('POST'); //  POST /product

        const singleProduct = product.addResource('{id}'); // /product/{id}
        singleProduct.addMethod('GET'); //  GET /product/{id}
        singleProduct.addMethod('PUT'); //  PUT /product/{id}
        singleProduct.addMethod('DELETE'); //  DELETE /product/{id}
    }

    private createBasketApi(basketMicroservice: IFunction) {
        const apiGateway = new LambdaRestApi(this, 'basketApi', {
            restApiName: 'basketService',
            handler: basketMicroservice,
            proxy: false
        });

        const basket = apiGateway.root.addResource('basket');
        basket.addMethod('GET');
        basket.addMethod('POST');

        const singleBasket = basket.addResource('{userName}');
        singleBasket.addMethod('GET');
        singleBasket.addMethod('DELETE');

        const basketCheckout = basket.addResource('checkout');
        basketCheckout.addMethod('POST');
    }
}
