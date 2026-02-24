import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('S3_BUCKET') || '';
    const region = this.configService.get<string>('AWS_REGION') || 'eu-north-1';

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
  }

  /**
   * Upload file to S3
   */
  async uploadFile(
    key: string,
    file: Buffer,
    contentType: string,
  ): Promise<void> {
    if (!this.bucketName) {
      throw new Error('S3_BUCKET environment variable is not configured');
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    try {
      await this.s3Client.send(command);
    } catch (error: any) {
      // Provide more specific error messages
      if (error.name === 'NoSuchBucket') {
        throw new Error(
          `S3 bucket "${this.bucketName}" does not exist. Please verify the bucket name in your configuration.`
        );
      }
      if (error.name === 'AccessDenied' || error.name === 'InvalidAccessKeyId') {
        throw new Error(
          'AWS credentials are invalid or do not have permission to upload to S3. Please check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.'
        );
      }
      if (error.name === 'NetworkError' || error.code === 'ECONNREFUSED') {
        throw new Error(
          'Cannot connect to AWS S3. Please check your network connection and AWS_REGION configuration.'
        );
      }
      // Generic error with AWS error details
      throw new Error(
        `Failed to upload file to S3: ${error.message || error.toString()}. Please check your S3 configuration.`
      );
    }
  }

  /**
   * Generate signed URL for downloading file (15 minutes expiry)
   */
  async getSignedDownloadUrl(key: string): Promise<string> {
    if (!this.bucketName) {
      throw new Error('S3_BUCKET environment variable is not configured');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      return await getSignedUrl(this.s3Client, command, { expiresIn: 900 }); // 15 minutes
    } catch (error: any) {
      if (error.name === 'NoSuchBucket' || error.name === 'NoSuchKey') {
        throw new Error(
          `File not found in S3 bucket "${this.bucketName}". The file may have been deleted or the S3 key is incorrect.`
        );
      }
      if (error.name === 'AccessDenied') {
        throw new Error(
          'AWS credentials do not have permission to access S3. Please check your AWS credentials.'
        );
      }
      throw new Error(
        `Failed to generate download URL: ${error.message || error.toString()}`
      );
    }
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string): Promise<void> {
    if (!this.bucketName) {
      throw new Error('S3_BUCKET environment variable is not configured');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error: any) {
      // Log but don't throw for delete operations (file might already be deleted)
      console.error(`Failed to delete S3 file "${key}":`, error.message || error.toString());
      // Re-throw only for critical errors
      if (error.name === 'AccessDenied') {
        throw new Error(
          'AWS credentials do not have permission to delete from S3. Please check your AWS credentials.'
        );
      }
      // For other errors (NoSuchKey, etc.), we silently fail as the file may already be gone
    }
  }
}
