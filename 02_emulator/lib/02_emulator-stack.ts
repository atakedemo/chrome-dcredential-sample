import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface EmulatorStackProps extends cdk.StackProps {
  instanceAmiId: string
  region: string
}

export class EmulatorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: EmulatorStackProps) {
    super(scope, id, props);

    // --------------------
    // VPC
    // --------------------
    // Create new VPC with 2 Subnets
    const vpc = new ec2.Vpc(this, 'VPC', {
      natGateways: 0,
      subnetConfiguration: [{
        cidrMask: 24,
        name: "asterisk",
        subnetType: ec2.SubnetType.PUBLIC
      }]
    });

    // --------------------
    // Security Group
    // --------------------
    const securityGroupEc2 = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      description: 'IBC LPC Node',
      allowAllOutbound: true
    });

    securityGroupEc2.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'allow HTTPS traffic from anywhere',
    );

    securityGroupEc2.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'allow HTTP traffic from anywhere',
    );

    // --------------------
    // IAM(Role, Policy)
    // --------------------
    // EC2インスタンス用のIAMロールを作成してSSMポリシーをアタッチ
    const ec2Role = new iam.Role(this, 'Ec2InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    // SSMのアクセスを許可するポリシーを追加
    ec2Role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));

    // --------------------
    // EC2
    // --------------------
    const instanceType = new ec2.InstanceType('i3.metal');
    const instance = new ec2.Instance(this, 'Instance', {
      vpc,
        vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
        instanceType,
        machineImage: ec2.MachineImage.genericLinux({
          [props?.region as string]: props?.instanceAmiId as string,
        }),
        requireImdsv2: true,
        role: ec2Role,
        securityGroup: securityGroupEc2,
        blockDevices: [
          {
            deviceName: "/dev/sda1",
            volume: ec2.BlockDeviceVolume.ebs(40),
          },
        ],
    });
  }
}
