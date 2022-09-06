/**
 * clcuenca.dev Alpha Stage. Defines the resources
 * for the Alpha Stage.
 * @author Carlos L. Cuenca
 * @version 0.1.0
 */

import { Construct, Stage } from '@aws-cdk/core'
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

    /// -----------
    /// Constructor

    constructor(scope: Construct, props: AlphaStageProps) {
        super(scope, props.stageId, { env: {
            account:    props.account,
            region:     props.region
        }});

    }

}
