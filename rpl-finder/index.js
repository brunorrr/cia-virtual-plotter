'use strict';

const fs = require('fs');
const path = require('path');

export default (rplDate, callback) => {
  // TODO Call Http service to get RPL

  // Obtain RPL data from streamed resource
  fs.readFile(path.join('tmp','Cia_AZU_CS.txt'), 'utf8', (err, data) => {
    if( err ) {
      //TODO Error Handling
      throw err;
    }
    processData(data);
  });

  // Handle crude data
  const processData = data => {
    callback(data.split('\r\n'));
  };
};