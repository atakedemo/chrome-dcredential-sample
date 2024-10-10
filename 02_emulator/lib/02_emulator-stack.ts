import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Repository } from "aws-cdk-lib/aws-ecr";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import { Construct } from 'constructs';

export class EmulatorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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
    const instanceType = new ec2.InstanceType('t3.xlarge');
    const autoScalingGroup = new ecs.AsgCapacityProvider(this, 'IbcAsgCapacityProvider', {
      autoScalingGroup: new autoscaling.AutoScalingGroup(this, 'IbcEcsAsg', {
        vpc,
        vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
        instanceType,
        machineImage: ecs.EcsOptimizedImage.amazonLinux2(
          ecs.AmiHardwareType.STANDARD,
        ),
        minCapacity: 1,
        maxCapacity: 1,
        role: ec2Role,
        securityGroup: securityGroupEc2,
        blockDevices: [
          {
            deviceName: "/dev/xvda",
            volume: autoscaling.BlockDeviceVolume.ebs(100),
          },
        ]
      }),
    });
  }
}
