import { promises as fs } from 'fs';
import { join } from 'path';
import { S3Client, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  } : undefined
});
const s3Bucket = process.env.S3_BUCKET || 'passm';
const isS3Storage = process.env.STORAGE_TYPE === 's3';

export async function readFile(path: string): Promise<string> {
  if (isS3Storage) {
    // Ensure the path is properly formatted for S3
    const s3Key = `crawl-reports/${path}`;
    console.log('Reading S3 file:', s3Key);
    
    const command = new GetObjectCommand({
      Bucket: s3Bucket,
      Key: s3Key,
    });

    try {
      const response = await s3Client.send(command);
      const content = await response.Body?.transformToString();
      if (!content) throw new Error('Empty content');
      return content;
    } catch (error) {
      console.error('Error reading S3 file:', error);
      throw error;
    }
  } else {
    const fullPath = join(process.cwd(), '..', 'crawl-reports', path);
    return fs.readFile(fullPath, 'utf-8');
  }
}

export async function fileExists(path: string): Promise<boolean> {
  if (isS3Storage) {
    const s3Key = `crawl-reports/${path}`;
    console.log('Checking S3 file existence:', s3Key);
    
    const command = new GetObjectCommand({
      Bucket: s3Bucket,
      Key: s3Key,
    });

    try {
      await s3Client.send(command);
      return true;
    } catch (error) {
      console.error('File not found in S3:', s3Key);
      return false;
    }
  } else {
    const fullPath = join(process.cwd(), '..', 'crawl-reports', path);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}

export async function listItems(prefix: string = ''): Promise<string[]> {
  if (isS3Storage) {
    const normalizedPrefix = prefix ? `crawl-reports/${prefix}/` : 'crawl-reports/';
    console.log('Listing S3 items with prefix:', normalizedPrefix);

    const command = new ListObjectsV2Command({
      Bucket: s3Bucket,
      Prefix: normalizedPrefix,
      Delimiter: '/'
    });

    try {
      const response = await s3Client.send(command);
      console.log('S3 response:', JSON.stringify(response, null, 2));

      if (prefix) {
        // If listing reports within a project, look for CommonPrefixes that contain 'report-'
        const items = (response.CommonPrefixes || [])
          .map(p => {
            const prefixParts = p.Prefix?.split('/') || [];
            // Find the part that contains 'report-'
            const reportPart = prefixParts.find(part => part.startsWith('report-'));
            return reportPart || '';
          })
          .filter(Boolean);
        
        console.log('Filtered report items:', items);
        return items;
      } else {
        // If listing projects
        const items = (response.CommonPrefixes || [])
          .map(p => p.Prefix?.split('/')
            .filter(part => part !== '' && part !== 'crawl-reports')[0])
          .filter(Boolean) as string[];
        
        console.log('Filtered project items:', items);
        return items;
      }
    } catch (error) {
      console.error('S3 listing error:', error);
      throw error;
    }
  } else {
    const fullPath = join(process.cwd(), '..', 'crawl-reports', prefix);
    try {
      const items = await fs.readdir(fullPath, { withFileTypes: true });
      return items.map(item => item.name);
    } catch (error) {
      console.error('Local filesystem listing error:', error);
      return [];
    }
  }
}

export async function listItemsRecursively(prefix: string = ''): Promise<string[]> {
  if (isS3Storage) {
    const normalizedPrefix = prefix ? `crawl-reports/${prefix}/` : 'crawl-reports/';
    console.log('Listing S3 items recursively with prefix:', normalizedPrefix);

    const command = new ListObjectsV2Command({
      Bucket: s3Bucket,
      Prefix: normalizedPrefix,
    });

    try {
      const response = await s3Client.send(command);
      console.log('S3 recursive response:', JSON.stringify(response, null, 2));

      // Get all file paths relative to the prefix
      const items = (response.Contents || [])
        .map(c => c.Key)
        .filter(Boolean)
        .map(key => key!.replace(normalizedPrefix, ''))
        .filter(key => key !== '');

      return items;
    } catch (error) {
      console.error('S3 recursive listing error:', error);
      throw error;
    }
  } else {
    const fullPath = join(process.cwd(), '..', 'crawl-reports', prefix);
    try {
      const items: string[] = [];
      const files = await fs.readdir(fullPath, { withFileTypes: true });
      
      for (const file of files) {
        if (file.isDirectory()) {
          const subItems = await listItemsRecursively(join(prefix, file.name));
          items.push(...subItems);
        } else {
          // Don't include the project and report-id in the path
          const path = join(prefix, file.name);
          const pathParts = path.split(/[\\/]/);
          const relativePath = pathParts.slice(2).join('/'); // Only remove project and report-id
          if (relativePath) {
            items.push(relativePath);
          }
        }
      }
      
      return items;
    } catch (error) {
      console.error('Local filesystem recursive listing error:', error);
      return [];
    }
  }
}
