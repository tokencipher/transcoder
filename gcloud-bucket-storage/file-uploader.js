// The ID Of your GCS bucket
//const bucketName = 'usr-uploaded-video';

// The path to your file upload
//const filePath = '../video/ogbkblock.mov';

// The new ID for your GCS file
//const destFileName = `ogbkblock${uniqID}.mov`;

// Imports the Google Cloud client library 
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

async function uploadFile(bucketName, filePath, destFileName) {
  const options = {
    destination: destFileName
    // Optional:
    // Set a generation-match precondition to avoid potential race conditions 
    // and data corruptions. The request to upload is aborted if the object's
    // generation number does not match your precondition. For a destination 
    // object that does not yet exist, set the ifGenerationMatch precondition 
    // to 0. If the destination object already exists in your bucket, set 
    // instead a generation-match precondition using its generation number. 
    //preconditionOpts: {ifGenerationMatch: generationMatchPrecondition},
  };

  await storage.bucket(bucketName).upload(filePath, options);
  console.log(`${filePath} uploaded to ${bucketName}`);
}

module.exports = uploadFile;

//uploadFile().catch(console.error);