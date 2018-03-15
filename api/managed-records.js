import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

function retrieve(options = {}) {
  // decompose search parameters from input
  if (!options.page) options.page = 1;
  if (!options.colors) options.colors = [];
  options.limit = 10;

  options.offset = (options.page - 1) * options.limit;
  // rewriting the options object to fit the query constraints. The
  // options object is given with a key of 'colors' while the query
  // query needs to be made with 'color[]'
  if (!options["color[]"]) options["color[]"] = [];
  options.colors.forEach(function(color) {
    options["color[]"].push(color);
  });

  // format search parameters;
  delete options.colors;
  delete options.page;

  var uri = URI(window.path).search(options);
  let query = window.path + "?" + uri.query();
  console.log(query)

  // construct an object to house all of the fetch promise constraints.
  var data = {};
  data.path = query;

  return postData(data).then(function(response) {
    console.log(response);
  }).catch(function(error) {
    console.log(error);
  });
}

function postData(data) {
  return new Promise(function (resolve, reject) {
    fetch({
      path: data.path,
      method: 'GET',
      headers: data.headers || {},
      queryParams: data.queryParams || {},
      body: JSON.stringify(data) || {}
    })
      .then(function(response) {
        console.log(response)
        if (response.status !== 200) {
          response.text()
            .then(function(text) {
              reject(text);
            });
        }
        response.json()
          .then(function(response) {
            resolve(response);
          });
      });
  });
}

export default retrieve;
