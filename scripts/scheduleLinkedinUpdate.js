const fs = require('fs');
const path = require('path');
const axios = require('axios');
const PORT = 3001;
const logfilename = 'scheduleLinkedinUpdate.log';

const invokeUpdateAll = async () => {
  let msg = 'linkedin/UpdateAll API invoked successfully.';
  try {
    await axios.get(`http://localhost:${PORT}/api/v1/linkedin/updateAll`);
  } catch (error) {
    msg = `Error invoking linkedin/UpdateAll API: ${error.message}`;
  }
  return msg;
};

// Function to log messages to a file
const logMessage = (message) => {
  const logFilePath = path.join(__dirname, logfilename);
  const currentDate = new Date().toLocaleString();

  fs.appendFile(logFilePath, `[${currentDate}] ${message}\n`, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
};

// Function to generate a random number between min (inclusive) and max (inclusive)
const getRandomTime = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to wait for a random time between 0 and 2 hours (in milliseconds)
const waitRandomTime = (min, max) => {
  const randomTime = getRandomTime(min, max);
  return new Promise((resolve) => {
    setTimeout(resolve, randomTime);
  });
};

// Function to schedule the update process
const scheduleUpdate = async (wait) => {
  if (wait) await waitRandomTime(0, 2 * 60 * 60 * 1000); // Wait for a random time between 0 and 2 hours
  return await invokeUpdateAll(); // Invoke the UpdateAll API
};

/* ******************** MAIN ******************** */
// Start the scheduling process

scheduleUpdate(process.argv[2] !== '--nowait').then((msg) => {
  logMessage(msg);
  console.log(`${new Date().toLocaleString()}, ${msg}`);
});
