'use strict';

import { findRpl, findDaily } from './finder';
import { parseRpl, parseDaily } from './parser';
import moment from 'moment';

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
            for (let flight of rplFlights) {
              if (flight.flightNumber == fullFlightId) {
                return flight;
              }
            }
            return {
              initialDate: moment(value.operationStartingDate, 'YYYY-MM-DD').toDate(),
              finalDate: moment(value.operationEndingDate, 'YYYY-MM-DD').toDate(),
              daysOfWeek: new Set([
                value.monday,
                value.tuesday,
                value.wednesday,
                value.thursday,
                value.friday,
                value.saturday,
                value.sunday
              ].map(value => value !== '0' ? value : null)),
              flightNumber: fullFlightId,
              airFrame: value.airframe,
              depAerodrome: value.departureIcao,
              depTime: moment(value.estimatedDeparture, 'HH:mm'),
              flightSpeed: '',
              flightAltitude: '',
              route: '',
              arrAerodrome: value.estimatedArrival,
              flightEet: '',
              remarks: ''
            };
          }));
        }
      )
    )
  );
};