'use strict';

import rplParser from './rpl-parser';
import dailyParser from './daily-parser';

const parseRpl = (data, callback) => rplParser(data, callback);
const parseDaily = (header, lines) => dailyParser(header, lines);

export { parseRpl, parseDaily };