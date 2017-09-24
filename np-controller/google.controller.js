/*
*
* Info控制器
* 无增加或删除，只有更新操作
* 如果程序是第一次运行，那么自动构建一条数据进去
*
*/
const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle')
const config = require('../np-config')
const googleapi = require('googleapis')
const googleCtrl = {}

const viewID = 'ga:157659572'

const googleMan = getdefaultObj(googleapi)


function getdefaultObj(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 获取InfoJs
googleCtrl.GET = (req, res) => {
    const jwtClient = new googleMan.default.auth.JWT(config.GOOGLEANALTTICS.client_email, null, config.GOOGLEANALTTICS.private_key, ['https://www.googleapis.com/auth/analytics.readonly'], null)
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        console.log(err)
        return err
      }
      var analytics = googleMan.default.analytics('v3');
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
        console.log('Google Analytics is starting to fetch data.')
        // 7天内，数据
          let googleAnalyticsChartData = JSON.stringify(response, null, 4).rows
          // 获取到Google分析的数据,开始处理数据
          const tags = []
          const users = []
          const sessions = []
          const pageviews = []
        
          for(let i =0; i<googleAnalyticsChartData.length; i++){
            tags.push(googleAnalyticsChartData[i][0])
            users.push(googleAnalyticsChartData[i][1])
            sessions.push(googleAnalyticsChartData[i][2])
            pageviews.push(googleAnalyticsChartData[i][3])
          }
       
          const chartVueJson = {}
          chartVueJson.tags = tags
          chartVueJson.users = users
          chartVueJson.sessions = sessions
          chartVueJson.pageviews = pageviews
          res.json({err: false, message: '获取成功', data: chartVueJson})
      })
    })  
}

module.exports = (req, res) => { handleRequest({ req, res, controller: googleCtrl }) }
