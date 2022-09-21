/**
 * Constants file
 * @author Carlos L. Cuenca
 * @version 0.9.0
 */

import { ApplicationProtocol } from 'aws-cdk-/aws-elasticloadbalancingv2'
import { SubnetType } from 'aws-cdk-/aws-ec2'

export module Constants {

    /// ---
    /// App

    export const Account    =   '669680791620'      ;
    export const Region     =   'us-east-1'         ;
    export const AppName    =   'clcuenca-dev'      ;
    export const Domain     =   'clcuenca.dev'      ;
    export const SiteDomain =   `site.${Domain}`    ;

    /// ------
    /// Stages

    export module Stages {

        /// -----
        /// Alpha

        export module Alpha {

            export const Name   =   'Alpha'         ;
            export const Id     =   `${Name}Stage`  ;

        }

    }

    /// ---
    /// ACM

    export module ACM {

        /// -----------
        /// Certificate

        export module Certificate {

            export const Id         =   `${AppName}Certificate` ;
            export const StackId    =   `${Id}Stack`            ;

        }

    }

    /// -----------
    /// Autoscaling

    export module AutoscalingGroup {

        export const Id         =   `${AppName}AutoScalingGroup`    ;
        export const Port       =   8080                            ;

    }

    /// ---
    /// EC2

    export module EC2 {
        
        /// ---
        /// VPC

        export module VPC {
            
            export const Id                 =   `${AppName}VPC`     ;
            export const StackId            =   `${Id}Stack`        ;
            export const CIDR               =   '10.0.0.0/16'       ;
            export const MaxAZs             =   2                   ;
            export const NATGateways        =   0                   ;
            export const EnableDNSHostNames =   true                ;
            export const EnableDNSSupport   =   true                ;

            /// --------------------
            /// Subnet Configuration

            export module SubnetConfiguration {

                export const SubnetName         = `${Constants.EC2.VPC.Id}Subnet`   ;
                export const SubnetCIDRMask     =   24                              ;
                export const Type               =   SubnetType.PRIVATE_ISOLATED             ;

            }

        }

    }

    /// ---
    /// ECS

    export module ECS {

        /// -----------------------------------------
        /// Application Load Balanced Fargate Service

        export module ApplicationLoadBalancedFargateService {

            export const Id                     =   `${AppName}ApplicationLoadBalancedFargateService`   ;
            export const StackId                =   `${Id}Stack`                                        ;
            export const Protocol               =                                                       ;
            export const RedirectHTTP           =                                                       ;
            export const PlatformVersion        =                                                       ;
            export const CPUs                   =                                                       ;
            export const MemoryLimit            =                                                       ;
            export const DesiredCount           =                                                       ;
            export const HasPublicLoadBalancer  =   true                                                ;

            /// ------------
            /// Target Group

            export module TargetGroup {

                /// ----------------------
                /// Configure Health Check

                export module ConfigureHealthCheck {

                    export const Enabled                    =   true        ;
                    export const Path                       =   '/status/'  ;
                    export const HealthyThresholdCount      =   3           ;
                    export const UnhealthyThresholdCount    =   2           ;

                }

            }

            /// ---------------
            /// Scalable Target

            export module ScalableTarget {

                export const TargetUtilizationPercent       =   75          ;
                export const MinimumTaskScalingCapacity     =   75          ;
                export const MaximumTaskScalingCapacity     =   75          ;

            }

        }

    }

    /// -----------
    /// Code Commit

    export module CodeCommit {

        export const Repository             = 'clcuenca-dev-cdk-typescript' ;
        export const PrimaryOutputDirectory = 'cdk.out'                     ;

        /// --------
        /// Branches

        export module Branches {

            export const Main = 'main'  ;

        }

        /// ----------
        /// Connection

        export module Connection {

            export const Arn = 'arn:aws:codestar-connections:us-east-1:669680791620:connection/7d2469ff-514a-4e4f-9003-5ca4a43cdc41';

        }

    }

    /// -------------
    /// Code Pipeline

    export module CodePipeline {

        export const Id         =   `${AppName}Pipeline`    ;
        export const StackId    =   `${Id}Stack`            ;
        export const SelfMutate =   true                    ;

        /// ---------
        /// ShellStep

        export module ShellStep {

            export const Id     =   `${AppName}ShellStep`   ;

        }

    }

    /// --------
    /// Cognito

    export module Cognito {

        export const Id                         =  `${AppName}Cognito`                  ;
        export const StackId                    =  `${Id}Stack`                         ;
        export const ServiceName                =   'cognito-identity.amazonaws.com'    ;
        export const AuthenticatedRoleId        =   `${Id}AuthenticatedRole`            ;
        export const UnauthenticatedRoleId      =   `${Id}UnauthenticatedRole`          ; 
        export const IdentityProviderId         =   `${Id}IdentityProvider`             ;
        export const IdentityProviderSecretArn  =   "arn:aws:secretsmanager:<region>:669680791620:secret:<secret-name>-<random-6-characters>"     ;

        /// ---------
        /// Federated

        export module Federated {

            export const AuthenticatedAssumeRoleAction   =   'sts:AssumeRoleWithWebIdentity';

        }

        /// -------------
        /// Identity Pool

        export module IdentityPool {

            export const Id                             =  `${AppName}IdentityPool`     ;
            export const StackId                        =  `${Id}Stack`                 ;
            export const AllowUnauthenticatedIdentities =   false                       ;

        }

        /// ---------
        /// User Pool

        export module UserPool {

            export const Id                 =   `${AppName}UserPool`            ;
            export const StackId            =   `${Id}Stack`                    ;
            export const ClientId           =   `${Id}Client`                   ; 
            export const SelfSignUpEnabled  =   true                            ;

            /// ---------------
            /// Sign In Aliases

            export module SignInAliases {

                export const EnableUserName =   true                                ;
                export const EnableEmail    =   true                                ;

            }

            /// -------------------
            /// Standard Attributes

            export module StandardAttributes {

                /// ---------
                /// Full Name

                export module FullName {

                    export const Required   =   true                                ;
                    export const Mutable    =   false                               ;

                }

            }

            /// ---------------
            /// Password Policy

            export module PasswordPolicy {

                export const MinimumLength  =   8                                   ;

            }

        }

    }

    /// --------
    /// DynamoDB

    export module DynamoDB {

        export const Id         =  `${AppName}DynamoDB`     ;
        export const StackId    =  `${Id}Stack`             ;

        /// -----------------
        /// Policy Statements

        export module PolicyStatements {

            /// ----------
            /// Basic Read

            export module BasicRead {

                export const AllowActions = [];

            }

        }

    }

    /// ----------------------
    /// Elastic Load Balancing

    export module ElasticLoadBalancing {

        /// -------------------------
        /// Application Load Balancer

        export module ApplicationLoadBalancer {

            export const Id                 =   `${AppName}LoadBalancer`            ;
            export const StackId            =   `${AppName}LoadBalancerStack`       ;
            export const ListenerId         =   `${AppName}LoadBalancerListener`    ;
            export const InternetFacing     =   true                                ;
            export const Listens            =   true                                ;
            export const Port               =   443                                 ;
            export const EnableHttp2        =   true                                ;


        }

    }

    /// -------
    /// Route53

    export module Route53 {

        /// -----------
        /// Hosted Zone

        export module HostedZone {

            export const Id         =   `${AppName}HostedZone`  ;
            export const StackId    =   `${Id}Stack`            ;

        }

        /// -------
        /// ARecord

        export module ARecord {

            export const Id         =   `${AppName}ARecord`     ;
            export const StackId    =   `${Id}Stack`            ;

        }

    }

}
