/**
 * Cluster Stack
 * @author Carlos L. Cuenca
 * @version 0.9.0
 */

import { Construct } from 'constructs'
import { Stack, Stage } from 'aws-cdk-lib'
import { Vpc } from 'aws-cdk-lib/aws-ec2'
import { Cluster } from 'aws-cdk-lib/aws-ecs'

/// -----------------
/// ClusterStackProps

export interface ClusterStackProps {
    account:        string,
    region:         string,
    id:             string,
    stackId:        string,
    vpc:            Vpc
}

/// ---------------------------
/// ClusterStack Implementation

export class ClusterStack extends Stack {

    /// ---------------
    /// Private Members

    private readonly _cluster: Cluster;

    /// ------------
    /// Constructors

    constructor(scope: Construct, props: ClusterStackProps) {
        super(scope, props.stackId, { env: {
            account: props.account,
            region:  props.region
        }});

        this._cluster = new Cluster(this, props.id, {
            vpc:     props.vpc
        });
        
    }

    /// -------
    /// Getters

    public get cluster() {

        return this._cluster;
        
    }

}
