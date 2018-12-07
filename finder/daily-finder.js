'use strict';

import fs from 'fs';
import path from 'path';
import moment from 'moment';
import https from 'https';
import URL from 'url';

export default (dailyUrl, callback) => {

  const tempFile = path.join('.', 'tmp', `daily_${moment().format('YYYYMMDD')}.csv`);

  const processDaily = () => {
    // Obtain daily data from streamed resource
    fs.readFile(tempFile, 'utf8', (err, data) => {
      if (err) {
        //TODO Error Handling
        throw err;
      }
      processData(data);
    });

    // Handle crude data
    const processData = data => {
      const dataArray = data.split('\r\n').filter(line => line.trim());
      callback(dataArray[0], dataArray.slice(1));
    };
  };

  if (!fs.existsSync(tempFile)) {
    const url = URL.parse(dailyUrl);

    const httpOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: url.method,
      rejectUnauthorized: false
    };
    https.get(httpOptions, res => {
      const { statusCode } = res;

      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
          `Status Code: ${statusCode}`);
      }
      if (error) {
        res.resume();
        throw error;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', chunk => rawData = rawData.concat(chunk));
      res.on('end', () => {
        try {
          fs.appendFile(tempFile, rawData, error => {
            if (error) {
              throw error;
            }
            processDaily();
          });
        } catch (e) {
          throw e;
        }
      });
    });
  } else {
    processDaily();
  }

};