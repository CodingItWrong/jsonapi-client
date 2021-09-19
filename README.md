# @codingitwrong/jsonapi-client

A lightweight client for making requests to a [JSON:API](https://jsonapi.org/) service.

- It doesn't attempt to provide a way to utilize every possible feature of JSON:API; instead, it offers a core set of functionality sufficient for most apps.
- It doesn't attempt to abstract away the JSON:API object format; instead, it returns JSON:API data as-is.

## Synopsis

```javascript
import { ResourceClient } from '@codingitwrong/jsonapi-client';

const resource = new ResourceClient({
  name: 'widgets',
  httpClient: axios.create(...),
});

resource.all()
  .then(response => console.log(response.data));

resource.create({
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

`@codingitwrong/jsonapi-client` needs to be configured with an `httpClient` object that handles the requests and responses. The easiest way to do this is to provide an [`axios`](https://axios-http.com/) instance configured with your server's base URL, the standard JSON:API content type, and optionally any authentication info your server requires.

```js
import axios from 'axios';
import { ResourceClient } from '@codingitwrong/jsonapi-client';

const token = "FILL_ME";

const httpClient = axios.create({
  baseURL: 'https://jsonapi-sandbox.herokuapp.com',
  headers: {
    'Content-Type': 'application/vnd.api+json',
    'Authentication': `Bearer ${token}`,
  },
});
const client = new ResourceClient({ name: 'widgets', httpClient });

client.all().then(results => console.log(results));
```

## Usage

### Reading Data

#### all

To retrieve all of the records for a resource, call the `all()` method. The method returns a promise that will resolve to the server's JSON response:

```javascript
resource.all().then(response => console.log(response.data));
```

#### find

To retrieve a single record by ID, call the `find()` method:

```javascript
resource.find({ id: 42 }).then(response => console.log(response.data));
```

#### where

To filter/query for records based on certain criteria, use the `where` method, passing it an object of filter keys and values to send to the server:

```javascript
const filter = {
  category: 'whizbang',
};
resource.where({ filter }).then(response => console.log(response.data));
```

#### related

Finally, to load records related via JSON:API relationships, use the `related` method. A nested resource URL is constructed like `categories/27/widgets`. (In the future we will look into using HATEOAS to let the server tell us the relationship URL).

```javascript
const parent = {
  type: 'category',
  id: 27,
};

resource.related({ parent }).then(response => console.log(response.data));
```

By default, the name of the relationship on `parent` is assumed to be the same as the name of the other model: in this case, `widgets`. In cases where the names are not the same, you can explicitly pass the relationship name:

```javascript
const parent = {
  type: 'categories',
  id: 27,
};

const relationship = 'purchased-widgets';

resource
  .related({ parent, relationship })
  .then(response => console.log(response.data));
```

#### Options

All read methods take an optional `options` property, consisting of an object of additional options to pass. Each key/value pair in the object is translated into a query string parameter key/value pair:

```js
resource.all({
  options: {
    include: 'comments',
  },
});

// requests to widgets?include=comments
```

### Writing

#### create

Creates a new record. The object passed in should follow the JSON:API object format, but the `type` can be omitted:

```js
widgetResource.create({
  attributes: {
    'name': 'My Widget',
    'creation-date': '2018-10-07',
  },
});
```

This isn't just limited to `attributes`; `relationships` can be passed in too.

#### update

Updates a record. Takes the `id` of the record and the `attributes` and/or `relationships` to update. No `type` argument is required, but if passed in it's ignored, so you can pass in a full record if you like.

```js
widgetResource.update({
  id: '42',
  attributes: {
    name: 'My Updated Widget',
  },
});
```

This isn't just limited to `attributes`; `relationships` can be passed in too.

#### delete

Deletes the passed-in record. Only the `id` property is used, so you can pass either a full record or just the ID:

```js
widgetResource.delete({ id: 42 });
```

## License

Apache-2.0
