'use strict';

import fs from 'fs';
import path from 'path';
import http from 'http';

export default (rplUrl, rplDate, callback) => {

  const tempFileName = rplUrl.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}|Cia_[A-Z]{3}_CS.txt$/g)
    .reduce((previous, current) => `${previous}_${current}`);
  const tempFile = path.join('.', 'tmp', tempFileName);

  const processRpl = () => {
    // Obtain RPL data from streamed resource
    fs.readFile(tempFile, 'utf8', (err, data) => {
      if (err) {
        //TODO Error Handling
        throw err;
      }
      callback(data.split('\r\n'));
    });

  };
  
  if (!fs.existsSync(tempFile)) {
    http.get(rplUrl, res => {
      const { statusCode } = res;

      if (statusCode !== 200) {
        res.resume();
        throw new Error('Request Failed.\n' +
          `Status Code: ${statusCode}`);
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', chunk => rawData = `${rawData}${chunk}` );
      res.on('end', () => {
        try {
          fs.appendFile(tempFile, rawData, error => {
            if( error ) {
              throw error;
            }
            processRpl();
          });
        } catch (e) {
          throw e;
        }
      });
    });
  } else {
    processRpl();
  }
};
