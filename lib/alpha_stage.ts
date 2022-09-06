/**
 * clcuenca.dev Alpha Stage. Defines the resources
 * for the Alpha Stage.
 * @author Carlos L. Cuenca
 * @version 0.1.0
 */

import { Construct, Stage } from '@aws-cdk/core'
import { HostedZoneStack } from './hosted_zone_stack'
import { CertificateStack } from './certificate_stack'
import { ARecordStack } from './a_record_stack'
import { Constants } from './constants'

/// ----------------
/// AlphaStage Props

export interface AlphaStageProps {
    account:    string,
    region:     string,
    stageId:    string,
    stageName:  string
}

/// -------------------------
/// AlphaStage Implementation

export class AlphaStage extends Stage {

    /// ---------------
    /// Private Members

    private readonly hostedZoneStack:   HostedZoneStack     ;
    private readonly certificateStack:  CertificateStack    ;
    private readonly recordStack:       ARecordStack        ;

    /// -----------
    /// Constructor

    constructor(scope: Construct, props: AlphaStageProps) {
        super(scope, props.stageId, { env: {
            account:    props.account,
            region:     props.region
        }});

        this.hostedZoneStack = new HostedZoneStack(this, {
            account:        props.account,
            region:         props.region,
            hostedZoneId:   Constants.Route53.HostedZone.Id,
            zoneName:       Constants.Domain
        });

        this.certificateStack = new CertificateStack(this, {
            account:        props.account,
            region:         props.region,
            domain:         Constants.SiteDomain,
            certificateId:  Constants.ACM.Certificate.Id
        });

        this.recordStack = new ARecordStack(this, {
            account:        props.account,
            region:         props.region,
            recordId:       Constants.Route53.ARecord.Id,
            domain:         Constants.SiteDomain,
            hostedZone:     this.hostedZoneStack.hostedZone,
            recordTarget:
        });

    }

}
