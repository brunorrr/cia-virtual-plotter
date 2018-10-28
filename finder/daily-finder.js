'use strict';

import fs from 'fs';
import path from 'path';

export default callback => {
  // TODO Call Http service to get daily

  // Obtain daily data from streamed resource
  fs.readFile(path.join('tmp','diario.csv'), 'utf8', (err, data) => {
    if( err ) {
      //TODO Error Handling
      throw err;
    }
    processData(data);
  });

  // Handle crude data
  const processData = data => {
    const dataArray = data.split('\r\n').filter( line => line.trim() );
    callback( dataArray[0], dataArray.slice(1) );
  };
};