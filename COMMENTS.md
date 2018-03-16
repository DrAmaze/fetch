# To Run Tests

1. Clone or download this repository
2. Navigate to the this folder's directory
3. Run `yarn install` or `npm install` in your terminal
4. Run `yarn test` or `npm run test` in your terminal

# Implementation Decisions

## Formatting `nextPage` and `previousPage` in Formatted Data

  The `retrieve` function receives an options object as an argument. The key of `page` corresponds to how much offset to provide to the returned data. Each incremented page number corresponds to an offset incremented by 10. In order to determine whether or not the keys of the transformed output, `nextPage` and `previousPage`, are `null`, I used intuition and knowledge of the API to solve this. My solution notes that if the page requested is 1, `previousPage = null`. I then note the same with the final page: if the page requested is `>= 50`, then `nextPage = null`. 

  This solution was chosen as it is the most efficient given the problem at hand: it makes a single `fetch()` request from the API, it only retrieves the page of data requested (spatial efficiency), and it successfully handles empty requests.

  This solution could be improved by making it more scalable. If the API were to suddenly offer more pieces of data, then the current solution would not adequately handle requests made for `page >= 50`.  

## URI Library

  In this program, the URI library is utilized to transform a series of query parameters into a valid url query string. By noting the arguments given to `retrieve()`, the function then sets the appropriate `limit`, `offset` (via the page number), and `color[]`. It then translates this parameter object into a valid query string using the libraries `search` function where `options` is the parameter object and `window.path` is the given API path.

      var uri = URI(window.path).search(options);

  The `color[]` was the least intuitive to translate as the query parameters are initially set to provide an invalid query string. The key of the query parameters is given as `colors=`; however, the query string itself must be formatted as `color[]=`. This translation is engineered by a `forEach` loop that redefines the key of the object to `"color[]"` and then deletes the old key, `colors`.
