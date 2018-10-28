'use strict';

import rplFinder from './rpl-finder';
import dailyFinder from './daily-finder';

const findRpl = (rplDate, callback) => rplFinder(rplDate, callback);
const findDaily = callback => dailyFinder(callback);

export { findRpl, findDaily };