/**
 * Policy Statements
 * @version 0.9.0
 */

import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Constants } from './constants'

export module PolicyStatements {

    export module DynamoDB {

        export class BasicReadPolicyStatement extends PolicyStatement {

            constructor(resourceArns: string[]) {
                super({
                    effect:     Effect.ALLOW,
                    actions:    Constants.DynamoDB.PolicyStatements.BasicRead.AllowActions,
                    resources:  resourceArns
                });
            
            }

        }

    }

}
