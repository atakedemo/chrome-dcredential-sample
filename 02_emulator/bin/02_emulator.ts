#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EmulatorStack } from '../lib/02_emulator-stack';

const app = new cdk.App();
new EmulatorStack(app, 'EmulatorStack', {
    region: 'ap-northeast-1',
    instanceAmiId: 'ami-0eba6c58b7918d3a1',
    hostedZoneId: 'Z036663027HMHLRMORQ6C',
    hostedZoneName: 'bam-b-00.com',
    domainName: 'adb.bam-b-00.com',
    acmArn: 'arn:aws:acm:ap-northeast-1:594175341170:certificate/1a4791b7-c128-41ef-9b8f-d8de2ded93b5',
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});
