// The ID of the bucket the original file is in 
// const srcBucketName = 'your-source-bucket';

// The ID of the GCS file to copy
// const srcFileName = 'your-file-name';

// The ID of the bucket to copy the file to
// const destBucketName = 'target-file-bucket';

// The ID of the GCS file to create
// const destFileName = 'target-file-name';

// Imports the Google Cloud client library 
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

async function copyFile(srcBucketName, srcFileName, destBucketName, destFileName) {
  const copyDestination = storage.bucket(destBucketName).file(destFileName);

  // Optional:
  // Set a generation-match precondition to avoid potential race conditions 
  // and data corruptions. The request to copy is aborted if the object's 
  // generation number does not match your precondition. For a destination
  // object that does not yet exist, set the ifGenerationMatch precondition 
  // to 0. If the destination object already exists in your bucket, set 
  // instead a generation-match precondition using its generation number. 
  const copyOptions = {
    preconditionOps: {
      ifGenerationMatch: 0
    }
  };

  // Copies the file to the other bucket
  await storage
    .bucket(srcBucketName)
    .file(srcFileName)
    .copy(copyDestination, copyOptions);

  console.log(
    `gs://${srcBucketName}/${srcFileName} copied to gs://${destBucketName}/${destFileName}`
  );
}

// copyFile.catch(console.error);

module.exports = copyFile;