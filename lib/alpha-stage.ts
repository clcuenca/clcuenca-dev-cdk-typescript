/**
 * Alpha Stage
 * @author Carlos L. Cuenca
 * @version 0.9.0
 */

import { Construct } from 'constructs'
import { Stage } from 'aws-cdk-lib'
import { HostedZoneStack } from './hosted-zone_stack'
import { CertificateStack } from './certificate-stack'
import { ARecordStack } from './a-record-stack'
import { VpcStack } from './vpc-stack'
import { ApplicationLoadBalancedFargateServiceStack } from './application-load-balancer-stack'
import { Constants } from './constants'

/// ----------------
/// AlphaStage Props

export interface AlphaStageProps {
    account:    string,
    region:     string,
    id:         string,
    stageName:  string
}

/// -------------------------
/// AlphaStage Implementation

export class AlphaStage extends Stage {

    /// ---------------
    /// Private Members

    private readonly hostedZoneStack:               HostedZoneStack                                 ;
    private readonly certificateStack:              CertificateStack                                ;
    private readonly recordStack:                   ARecordStack                                    ;
    private readonly vpcStack:                      VpcStack                                        ;
    private readonly applicationLoadBalancerStack:  ApplicationLoadBalancedFargateServiceStack      ;

    /// -----------
    /// Constructor

    constructor(scope: Construct, props: AlphaStageProps) {
        super(scope,    props.id, { env: {
            account:    props.account,
            region:     props.region
        }});

        this.cognitoStack = new CognitoStack(this, {
            account:                        props.account,
            region:                         props.region, 
            id:                             Constants.Cognito.Id,
            stackId:                        Constants.Cognito.StackId,
            userPoolId:                     Constants.Cognito.UserPool.Id,
            identityPoolId:                 Constants.Cognito.IdentityPool.Id,
            identityProviderId:             Constants.Cognito.IdentityProviderId,
            userPoolClientId:               Constants.Cognito.UserPool.ClientId,
            selfSignUpEnabled:              Constants.Cognito.UserPool.SelfSignUpEnabled,
            enableAliasUsername:            Constants.Cognito.UserPool.SignInAliases.EnableUserName,
            enableAliasEmail:               Constants.Cognito.UserPool.SignInAliases.EnableEmail,
            fullnameRequired:               Constants.Cognito.UserPool.StandardAttributes.FullName.Required,
            fullnameMutable:                Constants.Cognito.UserPool.StandardAttributes.FullName.Mutable,
            passwordMinimumLength:          Constants.Cognito.UserPool.PasswordPolicy.MinimumLength,
            allowUnauthenticatedIdentities: Constants.Cognito.IdentityPool.AllowUnauthenticatedIdentities,
            resourceArns:                   []
        });

        this.hostedZoneStack = new HostedZoneStack(this, {
            account:    props.account,
            region:     props.region,
            id:         Constants.Route53.HostedZone.Id,
            stackId:    Constants.Route53.HostedZone.StackId,
            zoneName:   Constants.Domain
        });

        this.certificateStack = new CertificateStack(this, {
            account:    props.account,
            region:     props.region,
            id:         Constants.ACM.Certificate.Id,
            stackId:    Constants.ACM.Certificate.StackId,
            domain:     Constants.SiteDomain,
            hostedZone: this.hostedZone
        });
        
        this.vpcStack = new VpcStack(this, {
            account:                props.account,
            region:                 props.region,
            id:                     Constants.EC2.VPC.Id,
            stackId:                Constants.EC2.VPC.StackId,
            cidr:                   Constants.EC2.VPC.CIDR,
            maxAzs:                 Constants.EC2.VPC.MaxAZs,
            natGateways:            Constants.EC2.VPC.NATGateways,
            enableDnsHostnames:     Constants.EC2.VPC.EnableDNSHostNames,
            enableDnsSupport:       Constants.EC2.VPC.EnableDNSSupport,
            subnetConfiguration:    [
                {
                    cidrMask:       Constants.EC2.VPC.SubnetConfiguration.SubnetCIDRMask,
                    name:           Constants.EC2.VPC.SubnetConfiguration.SubnetName,
                    subnetType:     Constants.EC2.VPC.SubnetConfiguration.Type
                }
            ]
        });

        this.applicationLoadBalancerStack = new ApplicationLoadBalancedFargateServiceStack(this, {
            account:                                        props.account,
            region:                                         props.region,
            id:                                             Constants.ApplicationLoadBalancedFargateService.Id,
            stackId:                                        Constants.ApplicationLoadBalancedFargateService.StackId,
            protocol:                                       Constants.ApplicationLoadBalancedFargateService.Protocol,
            certificate:                                    this.certificateStack.certificate,    
            redirectHTTP:                                   Constants.ApplicationLoadBalancedFargateService.RedirectHTTP,    
            platformVersion:                                Constants.ApplicationLoadBalancedFargateService.PlatformVersion,    
            serverlessCluster:                                  
            taskSubnets:                                    Constants.ApplicationLoadBalancedFargateService.TaskSubnets,    
            cpu:                                            Constants.ApplicationLoadBalancedFargateService.CPUs,    
            memoryLimit:                                    Constants.ApplicationLoadBalancedFargateService.MemoryLimit,    
            desiredCount:                                   Constants.ApplicationLoadBalancedFargateService.DesiredCount,    
            taskImageOptions:                               // Docker Image here    
            hasPublicLoadBalancer:                          Constants.ApplicationLoadBalancedFargateService.HasPublicLoadBalancer,
            minimumTaskScalingCapacity:                     Constants.ApplicationLoadBalancedFargateService.ScalableTarget.MinimumScalingCapacity,    
            maximumTaskScalingCapacity:                     Constants.ApplicationLoadBalancedFargateService.ScalableTarget.MaximumScalingCapacity,    
            targetUtilizationPercent:                       Constants.ApplicationLoadBalancedFargateService.ScalableTarget.TargetUtilizationPercent,    
            configureHealthCheckEnabled:                    Constants.ApplicationLoadBalancedFargateService.TargetGroup.ConfigureHealthCheck.Enabled,    
            configureHealthCheckPath:                       Constants.ApplicationLoadBalancedFargateService.TargetGroup.ConfigureHealthCheck.Path,    
            configureHealthCheckHealthyThresholdCount:      Constants.ApplicationLoadBalancedFargateService.TargetGroup.ConfigureHealthCheck.HealthyThresholdCount,    
            configureHealthCheckUnhealthyThresholdCount:    Constants.ApplicationLoadBalancedFargateService.TargetGroup.ConfigureHealthCheck.UnhealthyThresholdCount,
        });

        this.recordStack = new ARecordStack(this, {
            account:        props.account,
            region:         props.region,
            id:             Constants.Route53.ARecord.Id,
            stackId:        Constants.Route53.ARecord.StackId,
            domain:         Constants.SiteDomain,
            hostedZone:     this.hostedZoneStack.hostedZone,
            recordTarget:   this.applicationLoadBalancerStack.applicationLoadBalancer
        });

    }

}
