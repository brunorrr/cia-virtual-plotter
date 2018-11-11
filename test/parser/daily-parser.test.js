'use strict';

import { parseDaily } from '../../parser';
import fs from 'fs';
import path from 'path';

test('Return Data has 11 flights', () => {
  const data = fs.readFileSync(path.join(__dirname,'mocks', 'daily_f11.csv'), 'utf8').split('\r\n').filter( line => line.trim() );
  const parsedData = parseDaily(data[0], data.slice(1));
  expect(parsedData.length).toBe(11);
  expect(parsedData[parsedData.length - 1].arrivalName).toBe('MIAMI INTERNATIONAL AIRPORT - MIAMI, FLORIDA - ESTADOS UNIDOS DA AMÉRICA');
  expect(parsedData[0].departureIcao).toBe('LFPO');
});
