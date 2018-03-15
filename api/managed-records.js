import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

function retrieve(options = {}) {
  // decompose search parameters from input
  if (!options.offset) options.offset = 0;
  if (!options.page) options.page = 1;
  if (!options.colors) options.colors = [];
  options.limit = 10;
  var uri = URI(window.path).search(options);
  let query = window.path + "?" + uri.query() ;
  console.log(query);
  // fetch(query)
  //   .then(function(response) {
  //     return response.json();
  //   });
  // }
  postData(query); // what do i put as the second arg?
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
        if (response.status !== 200) {
          reject(new Error('hello'));
        }
        resolve(response.json());
      });
  });
}

export default retrieve;
