var googleapi = require('googleapis');
var ApiKeyFile = require('googleanalytics-37dc2864a705.json');
var viewID = 'ga:157659572';

var google = getdefaultObj(googleapi);
var Key = getdefaultObj(ApiKeyFile);

function getdefaultObj(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getGoogleAnalyticsData = () =>{
  const jwtClient = new google.default.auth.JWT(Key.default.client_email, null, Key.default.private_key, ['https://www.googleapis.com/auth/analytics.readonly'], null)
  jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err)
      return err
    }
    var analytics = google.default.analytics('v3');
    return queryData(analytics)
  })  
}

function queryData(analytics) {
  analytics.data.ga.get({
    'auth': jwtClient,
    'ids': viewID,
    'metrics': 'ga:users,ga:sessions,ga:pageviews',
    'max-results': 100,
    'start-date': '6daysAgo',
    'start-index': '1',
    'include-empty-rows':true,
    'end-date': 'today',
    'dimensions': 'ga:date'
  }, function (err, response) {
    if (err) {
      console.log(err);
      return;
    }
    return JSON.stringify(response, null, 4)
  })
}

module.exports = {
  getGoogleAnalyticsData
}