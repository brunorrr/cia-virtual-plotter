'use strict';

import rplFinder from './rpl-finder';
import parser from './parser';

export default callback => {
  rplFinder(null, dataArray => parser(dataArray, flights => callback(flights) ) ); 
};