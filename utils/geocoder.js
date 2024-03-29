const NodeGeocoder=require('node-geocoder');

var options = {
    provider: process.env.GEOCODER_PROVIDER,
  
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: process.env.GEOCODER_API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  };

  var geocoder = NodeGeocoder(options);


  module.exports=geocoder;