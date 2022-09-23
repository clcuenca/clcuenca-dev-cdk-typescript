#!/usr/bin/env node

/**
 * clcuenca.dev App file. Stiches the resources together.
 * @author Carlos L. Cuenca
 * @version 0.1.0
 */

import 'source-map-support/register';
import { App } from 'aws-cdk-lib'
import { ShellStep } from 'aws-cdk-lib/pipelines'
import { CodePipelineSource } from 'aws-cdk-lib/pipelines'
import { PipelineStack, PipelineStackProps } from '../lib/pipeline-stack'
import { AlphaStage } from '../lib/alpha-stage'
import { Constants } from '../lib/constants'

const app = new App();

const stages = [
    new AlphaStage(app, {
        account:    Constants.Account,
        region:     Constants.Region,
        id:         Constants.Stages.Alpha.Id,
        stageName:  Constants.Stages.Alpha.Name
    })];

new PipelineStack(app, {
    account:    Constants.Account,
    region:     Constants.Region,
    id:         Constants.CodePipeline.Id,
    stackId:    Constants.CodePipeline.StackId,
    shellStep:  new ShellStep(Constants.CodePipeline.ShellStep.Id, {
        input:  CodePipelineSource.connection(Constants.CodeCommit.Repository, Constants.CodeCommit.Branches.Main, {
            connectionArn: Constants.CodeCommit.Connection.Arn,
        }),
        commands: [
            'npm install typescript',
            'npx cdk synth'
        ],
        primaryOutputDirectory: Constants.CodeCommit.PrimaryOutputDirectory
    }),
    stages: stages
});

app.synth();

