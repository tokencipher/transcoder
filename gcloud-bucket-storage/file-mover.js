// The ID of your GCS bucket
// const bucketName = 'your-source-bucket';

// The ID of your GCS file
// const srcFileName = 'your-file-name';

// The new ID for your GCS file
// const destFileName = 'your-new-file-name';

// Imports the Google Cloud client library 
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

async function moveFile(bucketName, srcFileName, destFileName) {
  // Optional:
  // Set a generation-match precondition to avoid potential race conditions
  // and data corruptions. The request to copy is aborted if the object's
  // generation number does not match your precondition. For a destination 
  // object that does not yet exist, set the ifGenerationMatch precondition
  // to 0 if the destination object already exists in your bucket, set instead
  // a generation-match precondition using its generation number. 
  const moveOptions = {
    preconditionOpts: {
      ifGenerationMatch: 0
    }
  };

  // Moves the file within the bucket
  await storage
    .bucket(bucketName)
    .file(srcFileName)
    .move(destFileName, moveOptions);

  console.log(
    `gs://${bucketName}/${srcFileName} moved to gs://${bucketName}/${destFileName}`
  );
}

//moveFile.catch(console.error);

module.exports = moveFile;