/**
 * clcuenca-dev pipeline stack. Defines the pipeline for the
 * CDK.
 * @author Carlos L. Cuenca
 * @version 0.1.0
 */

import { Construct, Stack, Stage } from '@aws-cdk/core'
import { CodePipeline, ShellStep } from '@aws-cdk/pipelines'
import { Constants } from './constants'

/// ----------
/// Properties

export interface PipelineStackProps {
    account:    string,
    region:     string,
    stackId:    string,
    pipelineId: string,
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

        this.pipeline = new CodePipeline(this, props.pipelineId, {
            selfMutation:   Constants.CodePipeline.SelfMutate,
            synth:          props.shellStep
        });

        props.stages.forEach( (stage) => {
            this.pipeline.addStage(stage);
        });

    }

}
