import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

function retrieve(options = {}) {
  // decompose search parameters from input
  if (!options.page) options.page = 1;
  if (!options.colors) options.colors = [];
  var limit = 10;
  var uri = URI(window.path).search(options);
  let path = window.path + "?" + uri.query();
  console.log(path)
  fetch(path);
}

export default retrieve;
