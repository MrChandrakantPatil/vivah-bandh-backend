import { S3Client } from '@aws-sdk/client-s3';
import { AWS_CONFIG } from '../../config/aws.config.js';

export const s3Client = new S3Client({
  region: AWS_CONFIG.AWS_REGION,
});
