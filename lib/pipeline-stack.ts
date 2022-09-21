/**
 * Pipeline stack
 * @author Carlos L. Cuenca
 * @version 0.9.0
 */

import { Construct } from 'constructs'
import { Stage, Stack } from 'aws-cdk-lib'
import { CodePipeline, ShellStep } from 'aws-cdk-lib/pipelines'
import { Constants } from './constants'

/// ----------
/// Properties

export interface PipelineStackProps {
    account:    string,
    region:     string,
    id:         string,
    stackId:    string,
    shellStep:  ShellStep,
    stages:     Stage[]
}

/// --------------------
/// Class Implementation

export class PipelineStack extends Stack {

    /// ---------------
    /// Private Members

    private readonly pipeline: CodePipeline ;

    /// -----------
    /// Constructor

    constructor(scope: Construct, props: PipelineStackProps) {
        super(scope, props.stackId, { env: {
            account: props.account,
            region:  props.region
        }});

        this.pipeline = new CodePipeline(this, props.id, {
            selfMutation:   Constants.CodePipeline.SelfMutate,
            synth:          props.shellStep
        });

        props.stages.forEach( (stage) => {
            this.pipeline.addStage(stage);
        });

    }

}
