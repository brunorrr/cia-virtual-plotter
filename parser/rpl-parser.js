'use strict';

import moment from 'moment';
import { forEachOf } from 'async';

export default (data, callback) => {

  /**
   * Finds all pages in the RPL file
   * @param {array} array Array with the crude data
   * @param {boolean} pageHasBegun Indication if the iteration has found a page already
   * @param {array} totalPages Used for recursive call to pass the processed pages to next iteration
   */
  const findNextPage = (array, pageHasBegun = false, totalPages = [] ) => {
    // Finding the next line that starts with "CIA:" finding from second element of the array
    const index = 1 + array.slice(1).findIndex(element => element.match(/^(CIA:)+/));
    // If have found a line starting with "CIA:"
    if( index !== 0 ) {
      // If have a page already, add it to pages array
      if( pageHasBegun ) {
        totalPages.push(array.slice(0, index));
      }
      // Finding the next page start
      findNextPage(array.slice(index), true, totalPages);
    } else if( pageHasBegun ) {
      // If end of file and has found 1 page at least, add it to array
      totalPages.push(array);
    }
    return totalPages;
  };

  /**
   * Process a page elements
   * @param {array} array Array with the page elements
   */
  const processPage = array => {
    let flights = [];
    let lastProcessedFlight = null;
    // By passing blank lines
    array = array.slice(7);
    array.forEach( value => {
      // If line starts with '   [number with 8 characters]', means it is a new flight line
      if( value.match(/^( {3}[0-9]{6})/) ){
        // If there is a flight already, then process it
        if( lastProcessedFlight ){
          flights.push( processLine(lastProcessedFlight) );
        }
        // Pass current flight to lastFlight
        lastProcessedFlight = [value];
      } else if( value ) {
        // If it is not a flight line, then it is a complement of last flight line, then, add it to lastFlight var
        lastProcessedFlight.push(value);
      }
    });
    // Add last element to array
    if( array ) {
      flights.push( processLine(lastProcessedFlight) );
    }
    return flights;
  };

  /**
   * Process all lines of a flight
   * @param {array} lineArray Flight lines array
   */
  const processLine = lineArray => {

    /**
     * Get information that is places in more than one line
     * @param {integer} start First Character of the sequence
     * @param {integer} end Last character of the sequence
     */
    const getMultipleLinesData = (start, end = lineArray[0].length) => {
      let data = '';
      lineArray.forEach( (element, index) => {
        data = data.concat( `${!index ? '' : ' '}${element.substring(start, end).trim()}` );
      });
      return data;
    };

    /*
      Example of line:
           221018 271018 1234560 AZU2571 A320/M SBTE0515 N0457 360 DCT TNA DCT ISUGU DCT               SBKP0247 EQPT/SDFGHIRWY PBN/B1D1O1S1   
                                                           LIVAD/N0452F380 DCT ILPUR UN741              EET/SBBS0132                  
                                                           MUKLO/N0454F370 UZ2 ENTIT DCT                
    */
    return {
      initialDate: moment(lineArray[0].substring(3,9), 'DDMMYY').toDate(),
      finalDate: moment(lineArray[0].substring(10,16), 'DDMMYY').toDate(),
      daysOfWeek: new Set(lineArray[0].substring(17,24).replace(/[0-9]/g,'').split('')),
      flightNumber: lineArray[0].substring(25,32),
      airFrame: lineArray[0].substring(33,37),
      depAerodrome: lineArray[0].substring(40,44),
      depTime: lineArray[0].substring(44,48),
      flightSpeed: lineArray[0].substring(49,54),
      flightAltitude: lineArray[0].substring(55,58),
      route: getMultipleLinesData(59, 95),
      arrAerodrome: lineArray[0].substring(95,99),
      flightEet: lineArray[0].substring(99,103),
      remarks: getMultipleLinesData(104)
    };
  };

  // Call page finder
  const pages = findNextPage(data);
  let flights = [];

  // For each page, iterates asynchronously
  forEachOf(pages, (page, key, callback) => {
    flights = flights.concat(processPage(page));
    callback();
  }, err => {
    if( !err ) {
      callback(flights);
    }
  });

};
