/**
 * Project Roles
 * @version 0.9.0
 */

import { Construct } from 'constructs'
import { Role, FederatedPrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam'
import { Constants } from './constants'
import { PolicyStatements } from './policy-statements' 

/// -----
/// Roles

export module Roles {

    /// -------
    /// Cognito

    export module Cognito {

        /// --------------------
        /// Unauthenticated Role

        export class UnauthenticatedRole extends Role {

            /// -----------
            /// Constructor

            constructor(scope: Construct, id: string, arns: string[], identityPoolRef: any) {
                super(scope, id, {
                    description: 'Default role for anonymous users',
                    assumedBy: new FederatedPrincipal(
                        Constants.Cognito.ServiceName, {
                            StringEquals: {
                                'cognito-identity.amazonaws.com:aud': identityPoolRef,
                            },
                            'ForAnyValue:StringLike': {
                                'cognito-identity.amazonaws.com:amr': 'unauthenticated',
                            },
                        },
                        Constants.Cognito.Federated.AuthenticatedAssumeRoleAction),
                    managedPolicies: [
                        new ManagedPolicy(scope, `${id}Policy`,
                            {
                                statements: [new PolicyStatements.DynamoDB.BasicReadPolicyStatement(arns)]
                            })
                    ]

                });

            }

        }

        /// ------------------
        /// Authenticated Role

        export class AuthenticatedRole extends Role {

            /// -----------
            /// Constructor

            constructor(scope: Construct, id: string, arns: string[], identityPoolRef: any) {
                super(scope, id, {
                    description: 'Default role for authenticated users',
                    assumedBy: new FederatedPrincipal(
                        Constants.Cognito.ServiceName, {
                            StringEquals: {
                                'cognito-identity.amazonaws.com:aud': identityPoolRef,
                            },
                            'ForAnyValue:StringLike': {
                                'cognito-identity.amazonaws.com:amr': 'authenticated',
                            },
                        },
                        Constants.Cognito.Federated.AuthenticatedAssumeRoleAction),
                    managedPolicies: [
                        new ManagedPolicy(scope, `${id}Policy`,
                            {
                                statements: [new PolicyStatements.DynamoDB.BasicReadPolicyStatement(arns)]
                            })
                    ]

                });

            }

        }

    }

}
