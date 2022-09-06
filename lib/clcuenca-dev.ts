/**
 * clcuenca.dev App file. Stiches the resources together.
 * @author Carlos L. Cuenca
 * @version 0.1.0
 */

import { App } from '@aws-cdk/core'
import { ShellStep } from '@aws-cdk/pipelines'
import { PipelineStack, PipelineStackProps } from './pipeline_stack'
import { AlphaStage } from './alpha_stage'
import { Constants } from './constants'

const app = new App();

const stages = [
    new AlphaStage(app, {
        account:    Constants.Account,
        region:     Constants.Region,
        stageId:    Constants.Stages.Alpha.Id,
        stageName:  Constants.Stages.Alpha.Name
    })];

new PipelineStack(app, {
    account:    Constants.Account,
    region:     Constants.Region,
    stackId:    Constants.CodePipeline.StackId,
    pipelineId: Constants.CodePipeline.Id,
    shellStep:  new ShellStep(Constants.CodePipeline.ShellStep.Id, {
        commands: []
    }),
    stages:     stages
});

app.synth();

