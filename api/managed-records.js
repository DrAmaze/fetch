import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

function retrieve(options) {
  // decompose search parameters from input
  if (!options.page) options.page = 1;
  if (!options.colors) options.colors = [];
  var limit = 10;


}

export default retrieve;
