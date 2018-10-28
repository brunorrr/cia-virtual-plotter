'use strict';

const fieldNameMapping = [
  'compCode',
  'compName',
  'flightNumber',
  'airframe',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
  'seats',
  'sirosFlightNumber',
  'registryDate',
  'operationStartingDate',
  'operationEndingDate',
  'operationType',
  'serviceType',
  'transportSubject',
  'trip',
  'departureIcao',
  'departureName',
  'arrivalIcao',
  'arrivalName',
  'estimatedDeparture',
  'estimatedArrival',
  'codeshare'
];

export default (header, lines) => 
  lines.map( line => {
    let object = {};
    line.split(';').forEach((field, index) => {
      object[fieldNameMapping[index]] = field;
    });
    return object;
  });