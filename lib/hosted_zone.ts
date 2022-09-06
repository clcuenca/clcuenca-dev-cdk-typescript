/**
 * clcuenca.dev Hosted Zone Implementation.
 * @author Carlos L. Cuenca
 * @version 0.1.0
 */

import { Construct, Stack } from '@aws-cdk/core'
import { HostedZone } from '@aws-cdk/route53'

/// --------------------
/// HostedZoneStackProps

export interface HostedZoneStackProps {
    account:                    string,
    region:                     string,
    hostedZoneId:               string,
    zoneName:                   string,
}

/// ------------------------------
/// HostedZoneStack Implementation

export class HostedZoneStack extends Stack {

    /// ---------------
    /// Private Members

    private readonly hostedZone: HostedZone  ;

    /// -----------
    /// Constructor

    constructor(scope: Construct, props: PipelineStackProps) {
        super(scope, props.hostedZoneId, { env: {
            account: props.account,
            region:  props.region
        }});

        this.hostedZone = HostedZone.fromLookup(this, props.hostedZoneId, props.zoneName);
    }

    /// -------
    /// Getters

    public get hostedZone() {
        return this.hostedZone;
    }

}

