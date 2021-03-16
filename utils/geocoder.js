/**
 * Geocoder node-geocoder dependency configuration file
 * 
 */
const NodeGeocoder = require('node-geocoder');

const options = {
    provider : process.env.GEOCODER_PROVIDER,  
    httpAdapter: 'https',
    apiKey : process.env.GEOCODER_API_KEY,
    formatter : null
}

const goecoder = NodeGeocoder(options);

module.exports = goecoder;