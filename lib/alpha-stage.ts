/**
 * Alpha Stage
 * @author Carlos L. Cuenca
 * @version 0.9.0
 */

import { Construct } from 'constructs'
import { Stage } from 'aws-cdk-lib'
import { RecordTarget } from 'aws-cdk-lib/aws-route53'
import { LoadBalancerTarget } from 'aws-cdk-lib/aws-route53-targets'
import { ContainerImage } from 'aws-cdk-lib/aws-ecs'
import { ApplicationLoadBalancedTaskImageOptions } from 'aws-cdk-lib/aws-ecs-patterns'
import { CognitoStack } from './cognito-stack'
import { HostedZoneStack } from './hosted-zone-stack'
import { CertificateStack } from './certificate-stack'
import { ARecordStack } from './a-record-stack'
import { VpcStack } from './vpc-stack'
import { ClusterStack } from './cluster-stack'
import { ApplicationLoadBalancedFargateServiceStack } from './application-load-balanced-fargate-service-stack'
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

    private readonly cognitoStack:                  CognitoStack                                    ;
    private readonly hostedZoneStack:               HostedZoneStack                                 ;
    private readonly certificateStack:              CertificateStack                                ;
    private readonly recordStack:                   ARecordStack                                    ;
    private readonly vpcStack:                      VpcStack                                        ;
    private readonly clusterStack:                  ClusterStack                                    ;
    private readonly applicationLoadBalancerStack:  ApplicationLoadBalancedFargateServiceStack      ;

    /// -----------
    /// Constructor

    constructor(scope: Construct, props: AlphaStageProps) {
        super(scope,    props.id, { env: {
            account:    props.account,
            region:     props.region
        }});

        this.hostedZoneStack = new HostedZoneStack(this, {
            account:    props.account,
            region:     props.region,
            id:         Constants.Route53.HostedZone.Id,
            stackId:    Constants.Route53.HostedZone.StackId,
            domainName: Constants.Domain
        });

        this.certificateStack = new CertificateStack(this, {
            account:    props.account,
            region:     props.region,
            id:         Constants.ACM.Certificate.Id,
            stackId:    Constants.ACM.Certificate.StackId,
            domain:     Constants.SiteDomain,
            hostedZone: this.hostedZoneStack.hostedZone
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
                    name:           Constants.EC2.VPC.Subnet.Public.Configuration.Name,
                    cidrMask:       Constants.EC2.VPC.Subnet.Public.Configuration.CIDRMask,
                    subnetType:     Constants.EC2.VPC.Subnet.Public.Configuration.Type
                },       
                {
                    name:           Constants.EC2.VPC.Subnet.Private.Configuration.Name,
                    cidrMask:       Constants.EC2.VPC.Subnet.Private.Configuration.CIDRMask,
                    subnetType:     Constants.EC2.VPC.Subnet.Private.Configuration.Type
                }
            ]
        });

        this.clusterStack = new ClusterStack(this, {
            account:        props.account,
            region:         props.region,
            id:             Constants.ECS.Cluster.Id,
            stackId:        Constants.ECS.Cluster.StackId,
            vpc:            this.vpcStack.vpc
        });

        const taskImageOptions = {
                image:              ContainerImage.fromAsset(Constants.SourceDirectory, {
                        file:       'docker/Dockerfile',
                        target:     'alpha'
                    }
                ),
                container_name: 'app',
                container_port: 8000
                //environment: { Evironment Variables }
            };

        this.applicationLoadBalancerStack = new ApplicationLoadBalancedFargateServiceStack(this, {
            account:                                        props.account,
            region:                                         props.region,
            id:                                             Constants.ECS.ApplicationLoadBalancedFargateService.Id,
            cpuScalingId:                                   Constants.ECS.ApplicationLoadBalancedFargateService.ScalableTarget.CPUScalingId,
            stackId:                                        Constants.ECS.ApplicationLoadBalancedFargateService.StackId,
            protocol:                                       Constants.ECS.ApplicationLoadBalancedFargateService.Protocol,
            certificate:                                    this.certificateStack.certificate,    
            redirectHTTP:                                   Constants.ECS.ApplicationLoadBalancedFargateService.RedirectHTTP,    
            platformVersion:                                Constants.ECS.ApplicationLoadBalancedFargateService.PlatformVersion,    
            cluster:                                        this.clusterStack.cluster,
            taskSubnetType:                                 Constants.ECS.ApplicationLoadBalancedFargateService.TaskSubnetType,    
            cpu:                                            Constants.ECS.ApplicationLoadBalancedFargateService.CPUs,    
            memoryLimit:                                    Constants.ECS.ApplicationLoadBalancedFargateService.MemoryLimit,    
            desiredCount:                                   Constants.ECS.ApplicationLoadBalancedFargateService.DesiredCount,    
            taskImageOptions:                               taskImageOptions, 
            hasPublicLoadBalancer:                          Constants.ECS.ApplicationLoadBalancedFargateService.HasPublicLoadBalancer,
            minimumTaskScalingCapacity:                     Constants.ECS.ApplicationLoadBalancedFargateService.ScalableTarget.MinimumTaskScalingCapacity,    
            maximumTaskScalingCapacity:                     Constants.ECS.ApplicationLoadBalancedFargateService.ScalableTarget.MaximumTaskScalingCapacity,    
            targetUtilizationPercent:                       Constants.ECS.ApplicationLoadBalancedFargateService.ScalableTarget.TargetUtilizationPercent,    
            configureHealthCheckEnabled:                    Constants.ECS.ApplicationLoadBalancedFargateService.TargetGroup.ConfigureHealthCheck.Enabled,    
            configureHealthCheckPath:                       Constants.ECS.ApplicationLoadBalancedFargateService.TargetGroup.ConfigureHealthCheck.Path,    
            configureHealthCheckHealthyThresholdCount:      Constants.ECS.ApplicationLoadBalancedFargateService.TargetGroup.ConfigureHealthCheck.HealthyThresholdCount,    
            configureHealthCheckUnhealthyThresholdCount:    Constants.ECS.ApplicationLoadBalancedFargateService.TargetGroup.ConfigureHealthCheck.UnhealthyThresholdCount,
            vpc:                                            this.vpcStack.vpc
        });

        const ARecordTarget = RecordTarget.fromAlias(
            new LoadBalancerTarget(this.applicationLoadBalancerStack.loadBalancer));

        this.recordStack = new ARecordStack(this, {
            account:        props.account,
            region:         props.region,
            id:             Constants.Route53.ARecord.Id,
            stackId:        Constants.Route53.ARecord.StackId,
            domain:         Constants.SiteDomain,
            hostedZone:     this.hostedZoneStack.hostedZone,
            recordTarget:   ARecordTarget
        });

    }

}
