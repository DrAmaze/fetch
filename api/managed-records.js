import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

function retrieve(options = {}) {

  // decompose search parameters from input
  return new Promise(function(resolve, reject) {
    if (!options.page) options.page = 1;
    var page = options.page;          // used to format payload
    if (!options.colors) options.colors = [];

    // set the page displayed using the offset query.
    options.limit = 10;
    options.offset = (options.page - 1) * options.limit;

    // rewriting the options object to fit the query constraints. The
    // options object is given with a key of 'colors' while the query
    // query needs to be made with 'color[]'
    if (!options["color[]"]) options["color[]"] = [];
    options.colors.forEach(function(color) {
      options["color[]"].push(color);
    });

    // format search parameters to not include excess information;
    delete options.colors;
    delete options.page;

    var uri = URI(window.path).search(options);
    let query = window.path + "?" + uri.query();

    // construct an object to house all of the fetch promise constraints.
    var data = {};
    data.path = query;
    getData(data).then(function(response) {
      resolve(transformPayload(response, page));
    }).catch(function(error) {
      console.log(error);
      reject(error);
    });
  });
}

function getData(data) {
  return new Promise(function (resolve, reject) {
    fetch(data.path, {
      method: 'GET',
      headers: data.headers || {},
      queryParams: data.queryParams || {},
      // body: data.body || {}
    })
    .then(function(response) {
      // console.log('RES',response);
      if (!response.ok) {
        throw Error(response.statusText);
      }

      return response.json();
    })
    .then(function(response) {
      resolve(response);
    })
    .catch(function(error) {
      // console.log('ERRRRR', error);
      reject(error);
    });
  });
}

function transformPayload(payload, page) {
  var data = {
    ids: [],
    open: [],
    closedPrimaryCount: 0
  };

  // for empty results
  if (payload.length === 0 && page === 1) {
    data.previousPage = null;
    data.nextPage = null;
  } else {
    // parse page data
    data.previousPage = (page === 1) ? null : page - 1;
    data.nextPage = (page >= 50) ? null : page + 1;
  }

  var primaryColors = ['red', 'blue', 'yellow'];
  payload.forEach(function(datum) {
    // add id to data
    data.ids.push(datum.id);

    // determine whether or not datum is primary color
    var primary = primaryColors.includes(datum.color);

    if (datum.disposition === 'open') {
      // add isPrimary to datum, then add to output
      datum.isPrimary = primary;
      data.open.push(datum);
    } else if(datum.disposition === 'closed' && primary) {
      data.closedPrimaryCount++;
    }
  });

  return data;
}

export default retrieve;
