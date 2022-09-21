/**
 * Application Load Balanced Fargate Service Stack
 * @author Carlos L. Cuenca
 * @version 0.9.0
 */

import { Construct } from 'constructs'
import { Stage } from 'aws-cdk-lib'
import { Vpc, SubnetConfiguration } from 'aws-cdk-/aws-ec2'
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-/aws-ecs-patterns'
import { AutoScalingGroup } from 'aws-cdk-/aws-autoscaling'
import { Certificate } from 'aws-cdk-/aws-certificatemanaager'
import { ApplicationProtocol } from 'aws-cdk-/aws-elasticloadbalancingv2'
import { FargatePlatformVersion } from 'aws-cdk-/ecs'
import { ServerlessCluster } from 'aws-cdk-/aws-rds'

/// ------------------------------------------
/// ApplicationLoadBalancedFargateServiceStack

export interface ApplicationLoadBalancedFargateServiceStackProps {
    account:                                            string,
    region:                                             string,
    id:                                                 string,
    stackId:                                            string,
    protocol:                                           ApplicationProtocol,
    certificate:                                        Certificate,
    redirectHTTP:                                       boolean,
    platformVersion:                                    FargatePlatformVersion,
    serverlessCluster:                                  ServerlessCluster,
    taskSubnets:                                        SubnetSelection,
    cpu:                                                number,
    memoryLimit:                                        number,
    desiredCount:                                       number,
    taskImageOptions:                                   ApplicationLoadBalancedTaskImageOptions,
    hasPublicLoadBalancer:                              boolean,
    vpc:                                                Vpc,
    minimumTaskScalingCapacity:                         number,
    maximumTaskScalingCapacity:                         number,
    targetUtilizationPercent:                           number,
    configureHealthCheckEnabled:                        boolean,
    configureHealthCheckPath:                           string,
    configureHealthCheckHealthyThresholdCount:          number,
    configureHealthCheckUnhealthyThresholdCount:        number
}

/// ---------------------------------------------------------
/// ApplicationLoadBalancedFargateServiceStack Implementation

export class ApplicationLoadBalancedFargateServiceStack extends Stack {

    /// ---------------
    /// Private Members

    private readonly applicationLoadBalancedFargateService: ApplicationLoadBalancedFargateService;

    /// -----------
    /// Constructor

    constructor(scope: Construct, props: ApplicationLoadBalancedFargateServiceStackProps) {
        super(scope, props.stackId, { env: {
            account: props.account,
            region:  props.region
        }});

        this.applicationLoadBalancedFargateService = new ApplicationLoadBalancer(this, props.id, {
            protocol:           props.protocol,
            certificate:        props.certificate,
            redirectHTTP:       props.redirectHTTP,
            platformVersion:    props.platformVersion,
            cluster:            props.serverlessCluster,
            taskSubnets:        props.taskSubnets,
            cpu:                props.cpu,
            memoryLimit:        props.memoryLimit,
            desiredCount:       props.desiredCount,
            publicLoadBalancer: props.hasPublicLoadBalancer
            vpc:                props.vpc,
        });

        this.applicationLoadBalancedFargateService.targetGroup.configureHealthCheck({
            enabled:                    props.configureHealthCheckEnabled,
            path:                       props.configureHealthCheckPath,
            healthyThresholdCount:      configureHealthCheckHealthyThresholdCount,
            unhealthyThresholdCount:    configureHealthCheckUnhealthyThresholdCount
        });

        const scalableTarget = this.applicationLoadBalancedFargateService.service.autoScaleTaskCount({
            minimumCapacity:    props.minimumTaskScalingCapacity,
            maximumCapacity:    props.maximumTaskScalingCapacity
        });

        scalableTarget.scaleOnCpuUtilization({
            targetUtilizationPercent: props.targetUtilizationPercent
        });

    }

    /// -------
    /// Getters

    public get loadBalancer() {

        return this.applicationLoadBalancer;

    }

}

