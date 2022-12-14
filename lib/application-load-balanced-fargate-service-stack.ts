/**
 * Application Load Balanced Fargate Service Stack
 * @author Carlos L. Cuenca
 * @version 0.9.0
 */

import { Construct } from 'constructs'
import { Stage, Stack } from 'aws-cdk-lib'
import { Vpc, SubnetConfiguration } from 'aws-cdk-lib/aws-ec2'
import { ApplicationLoadBalancedFargateService, ApplicationLoadBalancedTaskImageOptions } from 'aws-cdk-lib/aws-ecs-patterns'
import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling'
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager'
import { ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import { Cluster, FargatePlatformVersion } from 'aws-cdk-lib/aws-ecs'
import { ServerlessCluster } from 'aws-cdk-lib/aws-rds'
import { SubnetType, SubnetSelection } from 'aws-cdk-lib/aws-ec2'

/// ------------------------------------------
/// ApplicationLoadBalancedFargateServiceStack

export interface ApplicationLoadBalancedFargateServiceStackProps {
    account:                                            string,
    region:                                             string,
    taskImageOptions:                                   ApplicationLoadBalancedTaskImageOptions,
    vpc:                                                Vpc,
    certificate:                                        Certificate,
    cluster:                                            Cluster,
    id:                                                 string,
    stackId:                                            string,
    cpuScalingId:                                       string,
    protocol:                                           ApplicationProtocol,
    redirectHTTP:                                       boolean,
    platformVersion:                                    FargatePlatformVersion,
    taskSubnetType:                                     SubnetType,
    cpu:                                                number,
    memoryLimit:                                        number,
    desiredCount:                                       number,
    hasPublicLoadBalancer:                              boolean,
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

        this.applicationLoadBalancedFargateService = new ApplicationLoadBalancedFargateService(this, props.id, {
            protocol:           props.protocol,
            certificate:        props.certificate,
            redirectHTTP:       props.redirectHTTP,
            platformVersion:    props.platformVersion,
            cluster:            props.cluster,
            taskSubnets:        {
                subnetType:     props.taskSubnetType
            },
            cpu:                props.cpu,
            memoryLimitMiB:     props.memoryLimit,
            desiredCount:       props.desiredCount,
            taskImageOptions:   props.taskImageOptions,
            publicLoadBalancer: props.hasPublicLoadBalancer
        });

        this.applicationLoadBalancedFargateService.targetGroup.configureHealthCheck({
            enabled:                    props.configureHealthCheckEnabled,
            path:                       props.configureHealthCheckPath,
            healthyThresholdCount:      props.configureHealthCheckHealthyThresholdCount,
            unhealthyThresholdCount:    props.configureHealthCheckUnhealthyThresholdCount
        });

        const scalableTarget = this.applicationLoadBalancedFargateService.service.autoScaleTaskCount({
            minCapacity:    props.minimumTaskScalingCapacity,
            maxCapacity:    props.maximumTaskScalingCapacity
        });

        scalableTarget.scaleOnCpuUtilization(props.cpuScalingId, {
            targetUtilizationPercent: props.targetUtilizationPercent
        });

    }

    /// -------
    /// Getters

    public get loadBalancer() {

        return this.applicationLoadBalancedFargateService.loadBalancer;

    }

}

