/**
 * A Record Stack implementation. Creates an A Record
 * that potentially points to a subdomain
 * @author Carlos L. Cuenca
 * @version 1.0.0
 */

import { Construct, Stack } from '@aws-cdk/core'
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/route53'

/// -----------------
/// ARecordStackProps

export interface ARecordStackProps {
    account:        string,
    region:         string,
    recordId:       string,
    domain:         string,
    hostedZone:     HostedZone,
    recordTarget:   RecordTarget
}

/// ---------------------------
/// ARecordStack Implementation

export class ARecordStack extends Stack {

    /// ---------------
    /// Private Members

    private readonly record: ARecord;

    /// ------------
    /// Constructors

    constructor(scope: Construct, props: ARecordStackProps) {
        super(scope, props.certificateId, { env: {
            account: props.account,
            region:  props.region
        }});

        this.record = new Record(this, props.recordId, {
            zone:       props.hostedZone,
            target:     props.recordTarget,
            recordName: props.domain
        });
        
    }

}
