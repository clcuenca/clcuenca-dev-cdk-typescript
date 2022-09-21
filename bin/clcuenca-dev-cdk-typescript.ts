#!/usr/bin/env node

/**
 * clcuenca.dev App file. Stiches the resources together.
 * @author Carlos L. Cuenca
 * @version 0.1.0
 */

import 'source-map-support/register';
import { App } from 'aws-cdk-lib'
import { ShellStep } from 'aws-cdk-lib/pipelines'
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
        input:  CodePipelineSource.connection(Constants.CodeCommit.Repository, Constants.CodeCommit.Branches.Main, {
            connectionArn: Constants.CodeCommit.Connection.Arn,
        }),
        commands: [
            'npm install typescript',
            'npx cdk synth',
            'npx cdk deploy'
        ],
        primaryOutputDirectory: Constants.CodeCommit.PrimaryOutputDirectory
    }),
    stages: stages
});

app.synth();

