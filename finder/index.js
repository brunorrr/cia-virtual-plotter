'use strict';

import rplFinder from './rpl-finder';
import dailyFinder from './daily-finder';

const findRpl = (rplUrl, rplDate, callback) => rplFinder(rplUrl, rplDate, callback);
const findDaily = (dailyUrl, callback) => dailyFinder(dailyUrl, callback);

export { findRpl, findDaily };