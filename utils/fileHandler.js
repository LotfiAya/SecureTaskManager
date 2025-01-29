const fs = require("fs");
const lockfile = require("proper-lockfile");
const logger = require("./logger");

const readData = async (filePath) => {
  let release;
  try {
    release = await lockfile.lock(filePath);
    const data = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    logger.error("Error reading data:", err);
    throw new Error("Failed to read data");
  } finally {
    if (release) await release();
  }
};

const writeData = async (filePath, data) => {
  let release;
  try {
    release = await lockfile.lock(filePath);
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    logger.error("Error writing data:", err);
    throw new Error("Failed to write data");
  } finally {
    if (release) await release();
  }
};

module.exports = { readData, writeData };
