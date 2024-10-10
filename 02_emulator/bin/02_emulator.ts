#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EmulatorStack } from '../lib/02_emulator-stack';

const app = new cdk.App();
new EmulatorStack(app, 'EmulatorStack');
