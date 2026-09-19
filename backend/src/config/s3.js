const { S3Client } = require("@aws-sdk/client-s3");

const REGION = process.env.AWS_REGION || "ap-southeast-1";
const BUCKET = process.env.S3_BUCKET || "shopvn-images";

const s3Client = new S3Client({
  region: REGION,
  ...(process.env.AWS_ACCESS_KEY_ID && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }),
});

console.log(`✅ S3 client initialized — bucket: ${BUCKET}`);

module.exports = { s3Client, BUCKET };
