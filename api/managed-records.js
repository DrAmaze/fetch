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

    // set the page displayed using the number of items to be returned.
    // The number of items to be returned is 10. The limit of the
    // request is set to 11 so that it can be determined whether or not
    // there is any data available on the next page. If there is data in
    // the final index of the returned array, then the next is page++.
    // If not, then nextPage = null.
    options.limit = 11;
    options.offset = (options.page - 1) * (options.limit - 1);

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
      if (!response.ok) {
        throw Error(response.statusText);
      }

      return response.json();
    })
    .then(function(response) {
      resolve(response);
    })
    .catch(function(error) {
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

  // Format the nextPage and previousPage for output values

  // logic for empty results
  if (payload.length === 0 && page === 1) {
    data.previousPage = null;
    data.nextPage = null;
  } else {
    // logic to determine previous page
    data.previousPage = (page === 1) ? null : page - 1;
    // logic to determine whether or not the next page has data. If
    // payload returns 11 objects, the the next page is page + 1. If not
    // the next page is null.
    if (payload.length > 10) {
      data.nextPage = page + 1;
      payload.pop();            // Ensure output is appropriately sized.
    } else {
      data.nextPage = null;
    }
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
