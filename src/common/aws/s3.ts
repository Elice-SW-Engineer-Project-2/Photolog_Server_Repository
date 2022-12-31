import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
dotenv.config({
  path: process.env.NODE_ENV == 'staging' ? '.env.staging' : '.env.dev',
});

const s3: AWS.S3 = new AWS.S3({ useAccelerateEndpoint: true });
s3.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
  signatureVersion: 'v4',
});

export { s3 };
