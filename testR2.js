const { loadEnvConfig } = require('@next/env');
loadEnvConfig('.');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY
  }
});

const command = new PutObjectCommand({
  Bucket: process.env.R2_BUCKET_NAME,
  Key: 'test-ping.txt',
  Body: Buffer.from('hello'),
  ContentType: 'text/plain'
});

console.log('Testing R2 with credentials:');
console.log('Account ID:', R2_ACCOUNT_ID);
console.log('Access Key:', R2_ACCESS_KEY_ID);
console.log('Secret:', R2_SECRET_ACCESS_KEY?.substr(0, 5) + '...');
console.log('Bucket:', process.env.R2_BUCKET_NAME);

r2Client.send(command)
  .then(() => console.log('R2 Upload Success!'))
  .catch(e => {
      console.log('----- R2 Upload ERROR -----');
      console.log(e.name, e.message);
  });
