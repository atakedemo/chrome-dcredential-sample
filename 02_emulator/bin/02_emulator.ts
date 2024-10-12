#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EmulatorStack } from '../lib/02_emulator-stack';

const app = new cdk.App();
new EmulatorStack(app, 'EmulatorStack', {
    instanceAmiId: 'ami-0eba6c58b7918d3a1',
    region: 'ap-northeast-1'
});
