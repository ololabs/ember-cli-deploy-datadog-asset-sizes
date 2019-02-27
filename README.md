# ember-cli-deploy-datadog-asset-sizes

[WIP]

Keep track of your ember apps asset sizes over time. Each deploy the addon will push your apps assets sizes to DataDog.

## Installation

```sh
ember install ember-cli-deploy-datadog-asset-sizes
```

### Add you DataDog keys
Add your DataDog key to deploy.js

```js
module.exports = function(deployTarget) {
  var ENV = {
    // truncated for brevity
    emberCliDeployAssetSizes: {
      DATADOG_API_KEY: <your-api-key>,
      DATADOG_APP_KEY: <your-app-key>,
      DATADOG_NAMESPACE: <some-namespace>
    }
  };

  // truncated for brevity
  return ENV;
};
```

Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd my-addon`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `npm test` – Runs `ember try:each` to test your addon against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
