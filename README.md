# @codingitwrong/jsonapi-client

A lightweight client for making requests to a [JSON:API](https://jsonapi.org/) service.

- It doesn't attempt to provide a way to utilize every possible feature of JSON:API; instead, it offers a core set of functionality sufficient for most apps.
- It doesn't attempt to abstract away the JSON:API object format; instead, it returns JSON:API data as-is.

## Synopsis

```javascript
import {ResourceClient} from '@codingitwrong/jsonapi-client';

const widgetClient = new ResourceClient({
  name: 'widgets',
  httpClient: axios.create(...),
});

widgetClient.all()
  .then(response => console.log(response.data));

widgetClient.create({
  attributes: {
    title: 'My Widget',
  },
});
```

## Installation

```sh
$ npm install --save @codingitwrong/jsonapi-client
```

or

```sh
$ yarn add @codingitwrong/jsonapi-client
```

`@codingitwrong/jsonapi-client` needs to be configured with an `httpClient` object that handles the requests and responses. The easiest way to do this is to provide an [`axios`](https://axios-http.com/) instance configured with your server's base URL and optionally any authentication info your server requires.

```js
import axios from 'axios';
import {ResourceClient} from '@codingitwrong/jsonapi-client';

const token = 'FILL_ME';

const httpClient = axios.create({
  baseURL: 'https://jsonapi-sandbox.herokuapp.com',
  headers: {'Authentication': `Bearer ${token}`},
});
const widgetClient = new ResourceClient({name: 'widgets', httpClient});

widgetClient.all()
  .then(response => console.log(response.data));
```

## Usage

### Reading Data

#### all([{options}])

To retrieve all of the records for a resource, call the `all()` method. The method returns a promise that will resolve to the [JSON:API document](https://jsonapi.org/format/#document-structure) the server responded with:

```javascript
resourceClient.all()
  .then(response => console.log(response.data));
```

Note that because the `response` is the full JSON:API document, the array of records is nested under the `data` key. This ensures you also have access to keys like `errors`, `meta`, and `included` when applicable.

#### Options

All methods that return records (so, all but `delete()`) take an optional `options` named argument, consisting of an object of additional options to pass. Each key/value pair in the object is translated into a query string parameter key/value pair:

```js
resourceClient.all({
  options: {
    include: 'comments',
    sort: '-createdAt',
    'page[number]': 1,
  },
});

// requests to widgets?include=comments&sort=-createdAt&page[number]=1
```

#### find({id, [options]})

To retrieve a single record by ID, call the `find()` method:

```javascript
resourceClient.find({id: 42})
  .then(response => console.log(response.data));
```

#### where({filter, [options]})

To filter/query for records based on certain criteria, use the `where` method, passing it an object of filter keys and values to send to the server:

```javascript
const filter = {
  category: 'whizbang',
};
resourceClient.where({filter})
  .then(response => console.log(response.data));

// requests to widgets?filter[category]=whizbang
```

#### related({parent, [options]})

Finally, to load records related via JSON:API relationships, use the `related` method. A nested resource URL is constructed like `categories/27/widgets`.

```javascript
const parent = {
  type: 'category',
  id: 27,
};

resourceClient.related({parent})
  .then(response => console.log(response.data));

// requests to categories/27/widgets
```

By default, the name of the relationship on `parent` is assumed to be the same as the name of the other model: in this case, `widgets`. In cases where the names are not the same, you can explicitly pass the relationship name:

```javascript
const parent = {
  type: 'categories',
  id: 27,
};

const relationship = 'purchased-widgets';

resourceClient.related({parent, relationship})
  .then(response => console.log(response.data));

// requests to categories/27/purchased-widgets
```

### Writing

#### create({[attributes, relationships, options]})

Creates a new record. Either the `attributes`, `relationships`, or both can be passed. You do not need to pass in the `type` as the `ResourceClient` already knows what `type` it is for:

```js
widgetResource.create({
  attributes: {
    'name': 'My Widget',
    'creation-date': '2018-10-07',
  },
});
```

#### update({id, [attributes, relationships, options]})

Updates a record. Takes the `id` of the record and the `attributes` and/or `relationships` to update. No `type` argument is required, but if passed in it's ignored, so you can pass in a full record if you like.

```js
widgetResource.update({
  id: '42',
  attributes: {
    name: 'My Updated Widget',
  },
});
```

#### delete({id})

Deletes the passed-in record. Only the `id` property is used, so you can pass either a full record or just the ID:

```js
widgetResource.delete({id: 42});
```

## License

Apache-2.0
