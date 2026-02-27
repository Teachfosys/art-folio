import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

let cachedClient = null;

export const getR2Client = () => {
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return cachedClient;
};

export const R2_BUCKET = process.env.R2_BUCKET_NAME;
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

/**
 * Uploads a file buffer to Cloudflare R2
 * @param {Buffer} buffer - The file buffer
 * @param {string} fileName - The name of the file
 * @param {string} contentType - The MIME type of the file
 * @returns {Promise<string>} - The public URL of the uploaded object
 */
export async function uploadToR2(buffer, fileName, contentType) {
  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME) {
    throw new Error("Missing Cloudflare R2 environment variables.");
  }

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: contentType,
  });

  await getR2Client().send(command);

  // Return the public URL
  return `${process.env.R2_PUBLIC_URL}/${fileName}`;
}

/**
 * Deletes a file from Cloudflare R2
 * @param {string} fileName - The name of the file to delete (Key)
 */
export async function deleteFromR2(fileName) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
  });

  await getR2Client().send(command);
}
