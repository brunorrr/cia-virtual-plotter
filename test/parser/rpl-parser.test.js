'use strict';

import { parseRpl } from '../../parser';
import fs from 'fs';
import path from 'path';

test('Return data has 3 pages with 152 flights', done => {
  const data = fs.readFileSync(path.join(__dirname,'mocks', 'p03_f152.txt'), 'utf8').split('\r\n');
  parseRpl(data, flights => {
    expect(flights.length).toBe(152);
    const azu2464 = flights.filter( flight => flight.flightNumber === 'AZU2464' && flight.airFrame === 'AT72' )[0];
    expect(azu2464.route).toBe('DCT PENTE DCT 1645S04420W DCT MALBA DCT 1231S04457W/N0250F095 VFR DCT 1222S04458W DCT');
    done();
  });
});

test('Return data has 1 page with 13 flights', done => {
  const data = fs.readFileSync(path.join(__dirname,'mocks', 'p01_f13.txt'), 'utf8').split('\r\n');
  parseRpl(data, flights => {
    expect(flights.length).toBe(13);
    const azu2412 = flights.filter( flight => flight.flightNumber === 'AZU2412' && flight.daysOfWeek.has('2') )[0];
    expect(azu2412.remarks).toBe('EQPT/SDFGHIRWY PBN/A1B1D1O1S1S2 EET/SBBS0007');
    done();
  });
});