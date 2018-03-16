# To Run Tests

1. Clone or download this repository
2. Navigate to the this folder's directory
3. Run `yarn install` or `npm install` in your terminal
4. Run `yarn test` or `npm run test` in your terminal

# Implementation Decisions

## Formatting `nextPage` and `previousPage` in Formatted Data

  The `retrieve` function receives an options object as an argument. The key of `page` corresponds to how much offset to provide to the returned data. Each incremented page number corresponds to an offset incremented by 10. In order to determine whether or not the keys of the transformed output, `nextPage` and `previousPage`, are `null`, I used intuition and knowledge of the API to solve this.

  My solution notes that if the page requested is 1, `previousPage = null`. Determining `nextPage` is more difficult. In order to decide whether `nextPage` is `page + 1` or `null`, I use `limit = 11` in my `fetch()` request. In the case this provides one extra datum, the payload returned from the API will be an array of length 11, thus indicating the next page has data. If the response payload array has length less than 11, then there would be no data on the next page, thus `nextPage = null`.

  This solution was chosen as it is highly scalable and the most efficient given the problem at hand: it makes a single `fetch()` request from the API, it retrieves the page of data requested plus a single excess object (spatial efficiency), and it successfully handles empty requests. While this single excess object is more costly in terms of space, this space cost is negligible given the API and it allows the function to accurately return the data in the proper format.

## URI Library

  In this program, the URI library is utilized to transform a series of query parameters into a valid url query string. By noting the arguments given to `retrieve()`, the function then sets the appropriate `limit`, `offset` (via the page number), and `color[]`. It then translates this parameter object into a valid query string using the libraries `search` function where `options` is the parameter object and `window.path` is the given API path.

      var uri = URI(window.path).search(options);

  The `color[]` was the least intuitive to translate as the query parameters are initially set to provide an invalid query string. The key of the query parameters is given as `colors=`; however, the query string itself must be formatted as `color[]=`. This translation is engineered by a `forEach` loop that redefines the key of the object to `"color[]"` and then deletes the old key, `colors`.
