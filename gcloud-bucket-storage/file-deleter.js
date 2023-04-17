/**
 * Note: Deleting data might incur retrieval and early deletion charges if
 * the data was originally stored as Nearline storage, Coldline storage, 
 * or Archive storage. Also note that if you have enabled Object Versioning
 * for your bucket, the original object remains in your bucket until it is 
 * explicitly deleted using its generation number. 
 */

// The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

// The ID of your GCS file
// const fileName = 'your-file-name';

// Imports the Google Cloud client library 
const {Storage} = require('@google-cloud/storage');

// Creates a client 
const storage = new Storage();

// Optional:
// Set a generation-match precondition to avoid potential race conditions 
// and data corruptions. The request to delete is aborted if the object's
// generation number does not match your precondition. For a destination 
// object that does not yet exist, set the ifGenerationMatch precondition 
// to 0. If the destination object already exists in your bucket, set
// instead generation-match precondition using its generation number. 
const deleteOptions = {
  ifGenerationMatch: 0
};

async function deleteFile(bucketName, fileName) {
  await storage.bucket(bucketName).file(fileName).delete();

  console.log(`gs://${bucketName}/${fileName} deleted`);
}

//deleteFile().catch(console.error);

module.exports = deleteFile;