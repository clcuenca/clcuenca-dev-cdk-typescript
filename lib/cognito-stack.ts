/**
 * Cognito Stack
 * @version 0.9.0
 */

import { CfnIdentityPool, CfnIdentityPoolRoleAttachment,
         UserPool, UserPoolClient, UserPoolIdentityProviderAmazon } from 'aws-cdk-lib/aws-cognito'
import { Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Role } from 'aws-cdk-lib/aws-iam'
import { Secret } from 'aws-cdk-lib/aws-secretsmanager'
import { Constants } from './constants'
import { Roles } from './roles'

/// -----------------
/// CognitoStackProps

export interface CognitoStackProps {
    account:                        string,
    region:                         string, 
    id:                             string,
    stackId:                        string,
    userPoolId:                     string,
    identityPoolId:                 string,
    identityProviderId:             string,
    userPoolClientId:               string,
    selfSignUpEnabled:              boolean,
    enableAliasUsername:            boolean,
    enableAliasEmail:               boolean,
    fullnameRequired:               boolean,
    fullnameMutable:                boolean,
    passwordMinimumLength:          number,
    allowUnauthenticatedIdentities: boolean
}

/// ---------------------------
/// CognitoStack Implementation

export class CognitoStack extends Stack {

    private readonly userPool:                          UserPool
    private readonly identityPool:                      CfnIdentityPool
    private readonly userPoolClient:                    UserPoolClient
    private readonly userPoolIdentityProviderAmazon:    UserPoolIdentityProviderAmazon

    constructor (scope: Construct, props: CognitoStackProps) {
        super(scope, props.stackId, { env: {
            account:    props.account,
            region:     props. region
        }});

        this.userPool = new UserPool(this, props.userPoolId, {
            selfSignUpEnabled:          props.selfSignUpEnabled,
            signInAliases: {
                username:               props.enableAliasUsername,
                email:                  props.enableAliasEmail
            },
            standardAttributes: {
                fullname: {
                    required:           props.fullnameRequired,
                    mutable:            props.fullnameMutable
                }
            },
            passwordPolicy: {
                minLength:              props.passwordMinimumLength,
            },
        });
        
        this.userPoolClient = new UserPoolClient(this, props.userPoolClientId, {
            userPool: this.userPool
        });

        this.userPoolIdentityProviderAmazon = new UserPoolIdentityProviderAmazon(this, props.identityProviderId, {
            userPool:       this.userPool,
            clientId:       props.userPoolClientId,
            clientSecret:   Secret.fromSecretAttributes(this, `${props.id}IdentityProviderSecret`, {
                secretCompleteArn: Constants.Cognito.IdentityProviderSecretArn
            }).secretValue.unsafeUnwrap()
        });

        const identityProviderDomain = `cognito-idp.${Stack.of(this).region}.amazonaws.com/${this.userPool.userPoolId}:${this.userPoolClient.userPoolClientId}`

        this.identityPool = new CfnIdentityPool(this, props.identityPoolId, {
            allowUnauthenticatedIdentities: props.allowUnauthenticatedIdentities,
            cognitoIdentityProviders: [{
                clientId:       this.userPoolClient.userPoolClientId,
                providerName:   this.userPool.userPoolProviderName
                
            }]

       });

    }

}
