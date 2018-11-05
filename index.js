'use strict';

import { findRpl, findDaily } from './finder';
import { parseRpl, parseDaily } from './parser';

export default callback => {
  findDaily((header, lines) =>
    findRpl(
      null,
      rpl => parseRpl(
        rpl,
        rplFlights => {
          const dailyArray = parseDaily(header, lines);
          callback(dailyArray.map(value => {
            const fullFlightId = value.compCode.concat(value.flightNumber.replace(/^0+/, ''));
            for (let flight in rplFlights) {
              if (flight.flightNumber === fullFlightId) {
                return flight;
              }
            }
            // TODO returning Daily data
          }));
        }
      )
    )
  );
};