// The ID of your GCS bucket
// const bucketName = 'your-source-bucket';

// The ID of your GCS file
// const fileName = 'your-file-name';

// The path to which the file should be downloaded
// const destFileName = 'your-new-file-name';

// Imports the Google Cloud client library 
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

async function downloadFile(bucketName, fileName, destFileName) {
  const options = {
    destination: destFileName
  };

  // Downloads the file
  await storage.bucket(bucketName).file(fileName).download(options);

  console.log(
    `gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
  );
}

// downloadFile().catch(console.error);

module.exports = downloadFile;