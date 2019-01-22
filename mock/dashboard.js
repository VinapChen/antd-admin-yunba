import { Mock, Constant } from './_utils'

const { ApiPrefix, Color } = Constant
const { Clothes, Food ,Electronics } = {"Clothes":110, "Food":385 ,"Electronics":123}

const Dashboard =
  Mock.mock({
    'sales|30': [
      {
        'name|+1': 1970,
        // Clothes: Clothes,
        // Food: Food,
        'pv|300-450': 1,
        'uv|200-500':1,
      },
    ],
  })
//   cpu: {
//     'usage|50-600': 1,
//     space: 825,
//     'cpu|40-90': 1,
//     'data|20': [
//       {
//         'cpu|20-80': 1,
//       },
//     ],
//   },
//   browser: [
//     {
//       name: 'Google Chrome',
//       percent: 43.3,
//       status: 1,
//     },
//     {
//       name: 'Mozilla Firefox',
//       percent: 33.4,
//       status: 2,
//     },
//     {
//       name: 'Apple Safari',
//       percent: 34.6,
//       status: 3,
//     },
//     {
//       name: 'Internet Explorer',
//       percent: 12.3,
//       status: 4,
//     },
//     {
//       name: 'Opera Mini',
//       percent: 3.3,
//       status: 1,
//     },
//     {
//       name: 'Chromium',
//       percent: 2.53,
//       status: 1,
//     },
//   ],
//   user: {
//     name: 'github',
//     sales: 3241,
//     sold: 3556,
//   },
//   'completed|12': [
//     {
//       'name|+1': 2008,
//       'Task complete|200-1000': 1,
//       'Cards Complete|200-1000': 1,
//     },
//   ],
//   'comments|5': [
//     {
//       name: '@last',
//       'status|1-3': 1,
//       content: '@sentence',
//       avatar() {
//         return Mock.Random.image(
//           '48x48',
//           Mock.Random.color(),
//           '#757575',
//           'png',
//           this.name.substr(0, 1)
//         )
//       },
//       date() {
//         return `2016-${Mock.Random.date('MM-dd')} ${Mock.Random.time(
//           'HH:mm:ss'
//         )}`
//       },
//     },
//   ],
//   'recentSales|36': [
//     {
//       'id|+1': 1,
//       name: '@last',
//       'status|1-4': 1,
//       date() {
//         return `${Mock.Random.integer(2015, 2016)}-${Mock.Random.date(
//           'MM-dd'
//         )} ${Mock.Random.time('HH:mm:ss')}`
//       },
//       'price|10-200.1-2': 1,
//     },
//   ],
//   quote: {
//     name: 'Joho Doe',
//     title: 'test data',
//     content:
//       'http://0.0.0.0:8080/dataReturn',
//     avatar:
//       'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
//   },
//   numbers: [
//     {
//       icon: 'pay-circle-o',
//       color: Color.green,
//       title: 'Online Review',
//       number: 2781,
//     },
//     {
//       icon: 'team',
//       color: Color.blue,
//       title: 'New Customers',
//       number: 3241,
//     },
//     {
//       icon: 'message',
//       color: Color.purple,
//       title: 'Active Projects',
//       number: 253,
//     },
//     {
//       icon: 'shopping-cart',
//       color: Color.red,
//       title: 'Referrals',
//       number: 4324,
//     },
//   ],
// })


module.exports = {
  [`GET ${ApiPrefix}/dashboard`](req, res) {
    res.json(Dashboard)
  },
  [`POST ${ApiPrefix}/dashboard/uploaddata`](req, res) {
    const { Clothes, Food ,Electronics } = req.body
    console.log(Clothes,Food,Electronics);

    res.json({ success: true, message: 'Ok' })

  },

}
