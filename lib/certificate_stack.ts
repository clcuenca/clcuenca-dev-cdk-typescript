/**
 * Certificate Stack Implementation. Creates a Certificate
 * that validates a domain, and any wildcard subdomains the
 * corresponding HostedZone serves.
 * @author Carlos L. Cuenca
 * @version 1.0.0
 */

import { Construct, Stack } from '@aws-cdk/core'
import { Certificate, CertificateValidation } from '@aws-cdk/acm'

/// ---------------------
/// CertificateStackProps

export interface CertificateStackProps {
    account:        string,
    region:         string,
    domain:         string,
    certificateId:  string
}

/// -------------------------------
/// CertificateStack Implementation

export class CertificateStack extends Stack {

    /// ---------------
    /// Private Members

    private readonly certificate: Certificate;

    /// ------------
    /// Constructors

    constructor(scope: Construct, props: CertificateStackProps) {
        super(scope, props.certificateId, { env: {
            account: props.account,
            region:  props.region
        }});

        const wildcard = `*.${props.domain}`

        this.certificate = new Certificate(this, props.certificateId, {
            domainName:                 props.domain,
            subjectAlternativeNames:    [wildcard],
            validation:                 CertificateValidation.fromDnsMultiZone({
                    props.domain:       props.domain,
                    wildcard:           props.domain
                });
            
        });
        
    }

    /// -------
    /// Getters

    public get certificate() {
        return this.certificate;
    }

}
