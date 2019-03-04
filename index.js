'use strict';

var RSVP = require('rsvp');

var sendDeployData = function(assets, config, target) {
  var dogapi = require('dogapi');

  dogapi.initialize({
    api_key: config.DATADOG_API_KEY,
    app_key: config.DATADOG_APP_KEY
  });

  var pushedAssets = assets.map(function(asset){
    asset.name = asset.name.split(/-[a-f0-9]{32}/ig).join('');
    return asset;
  })

  var namespace = config.DATADOG_NAMESPACE || 'embercli.deploy';

  var now = parseInt(new Date().getTime() / 1000);

  return new RSVP.Promise(function(resolve, reject) {
    let metrics = [];
    for (let i = 0; i < pushedAssets.length; i++) {
      let asset = pushedAssets[i];
      metrics.push({
        metric: namespace + '.build.size',
        points: [[now, asset['size']]],
        metric_type: 'count',
        tags: [
          'filename:' + asset['name'],
          'environment:' + target
        ]
      });

      metrics.push({
        metric: namespace + '.build.gzipSize',
        points: [[now, asset['gzipSize']]],
        metric_type: 'count',
        tags: [
          'filename:' + asset['name'],
          'environment:' + target
        ]
      });
    }

    try {
      dogapi.metric.send_all(metrics);
      resolve(metrics);
    } catch(e) {
      reject(e);
      console.log(e);
    }
  });
}

module.exports = {
  name: 'ember-cli-deploy-datadog-asset-sizes',

  createDeployPlugin: function(options) {
    return {
      name: options.name,

      didBuild: function(context) {
        var emberCliDeployAssetSizesConfig = context.config.emberCliDeployDataDogAssetSizes;
        var target = context.deployTarget;
        var outputPath = context.project.root + '/' + context.distDir;

        var AssetSizePrinter = require('ember-cli/lib/models/asset-size-printer');
        var sizePrinter = new AssetSizePrinter({
          ui: this.ui,
          outputPath: outputPath
        });

        var makeAssetSizesObject;

        if (typeof sizePrinter.makeAssetSizesObject !== 'undefined') {
          makeAssetSizesObject = sizePrinter.makeAssetSizesObject();
        } else {
          makeAssetSizesObject = require('./lib/make-asset-sizes-object')(outputPath);
        }

        return makeAssetSizesObject.then(function(assets){
          return sendDeployData(assets, emberCliDeployAssetSizesConfig, target);
        });
      }
    };

    return new DeployPlugin();
  }
};
