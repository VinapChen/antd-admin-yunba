import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Color } from 'utils'
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import styles from './sales.less'

var str = []
var url = ''
var url1 = ''

var jsonstr = '[]'
var jsonarray = eval('(' + jsonstr + ')')
var counter_jsonstr = '[{"name":"counter","value":0}]'
var counter_jsonarray = eval('(' + counter_jsonstr + ')')
var log_counter_jsonarray = eval('(' + counter_jsonstr + ')')
var chartname = ''

var allcounter = 0

function Sales({ data }) {
  // setTimeout(
  //   function ()
  //   {
  //
  //   console.log("time out");}
  // ,10000);
  url = 'http://0.0.0.0:8081/vars.do'
  url1 = 'http://navlog.gionee.com/vars.do/'
  // url1 = 'http://t-nav.gionee.com/vars.do'
  // url = 'http://127.0.0.1:5000/dataReturn'

  fetch(url1)
    .then(res => res.json())
    .then(res => {
      console.log(res)
      str = eval(res['ResultMsg'])
      log_counter_jsonarray = eval('(' + jsonstr + ')')

      for (var i = 0; i < str.length; i++) {
        var msg = eval(str[i])
        if (msg['value'][0]['yVal'] == null) {
          var jsonTemp = { name: msg['name'], value: 0 }
        } else {
          var jsonTemp = {
            name: msg['name'],
            value: msg['value'][0]['yVal'],
          }
        }

        log_counter_jsonarray.push(jsonTemp)
      }

      var jsonTemp = {
        name: 'log.write.fail.counter',
        value:
          log_counter_jsonarray[0]['value'] - log_counter_jsonarray[1]['value'],
      }
      log_counter_jsonarray.push(jsonTemp)
    })

  // fetch(url)
  //   .then(res => res.json())
  //   .then(res => {
  //     console.log(res)
  //     // str = res;
  //     // console.log(res["ResultMsg"]);
  //     str = eval(res['ResultMsg'])
  //     // console.log(str.length)
  //     // console.log(str)
  //
  //     jsonstr = '[]'
  //     jsonarray = eval('(' + jsonstr + ')')
  //     counter_jsonstr = '[]'
  //     counter_jsonarray = eval('(' + counter_jsonstr + ')')
  //     //先取到总数，方便延迟数组排序
  //     for (var i = 0; i < str.length; i++) {
  //       if (str[i]['name'] == 'mysql.read.all.count') {
  //         allcounter = str[i]['value'][0]['yVal'] % 100
  //       } else {
  //         allcounter = 0
  //       }
  //     }
  //
  //     //解析json数据 转换数据
  //     for (var i = 0; i < str.length; i++) {
  //       var msg = eval(str[i])
  //       // chartname[i] = str[i]["name"];
  //       if (str[i]['name'] == 'mysql.read.latency') {
  //         // console.log(msg_value["value"])
  //         // console.log(msg["value"].length+msg["value"][0]["yVal"])
  //         var date
  //         var D = ''
  //         var T = ''
  //
  //         console.log('allcounter' + allcounter)
  //         //超过100 从头覆盖，给数组显示排序，allcounter%100 ~ 100 为发生在前的数据
  //         for (var j = allcounter; j < msg['value'].length; j++) {
  //           date = new Date(msg['value'][j]['xVal'])
  //           D =
  //             date.getFullYear() +
  //             '-' +
  //             (date.getMonth() + 1 < 10
  //               ? '0' + (date.getMonth() + 1)
  //               : date.getMonth() + 1) +
  //             '-' +
  //             (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
  //             ' '
  //           T =
  //             (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
  //             ':' +
  //             (date.getMinutes() < 10
  //               ? '0' + date.getMinutes()
  //               : date.getMinutes()) +
  //             ':' +
  //             (date.getSeconds() < 10
  //               ? '0' + date.getSeconds()
  //               : date.getSeconds())
  //           var jsonTemp = {
  //             name: msg['name'],
  //             'mysql.read.latency': msg['value'][j]['yVal'] / 1000000,
  //             xVal: D + T,
  //           }
  //
  //           jsonarray.push(jsonTemp)
  //         }
  //         for (var j = 0; j < allcounter; j++) {
  //           date = new Date(msg['value'][j]['xVal'])
  //           D =
  //             date.getFullYear() +
  //             '-' +
  //             (date.getMonth() + 1 < 10
  //               ? '0' + (date.getMonth() + 1)
  //               : date.getMonth() + 1) +
  //             '-' +
  //             (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
  //             ' '
  //           T =
  //             (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
  //             ':' +
  //             (date.getMinutes() < 10
  //               ? '0' + date.getMinutes()
  //               : date.getMinutes()) +
  //             ':' +
  //             (date.getSeconds() < 10
  //               ? '0' + date.getSeconds()
  //               : date.getSeconds())
  //           var jsonTemp = {
  //             name: msg['name'],
  //             'mysql.read.latency': msg['value'][j]['yVal'] / 1000000,
  //             xVal: D + T,
  //           }
  //
  //           jsonarray.push(jsonTemp)
  //         }
  //         chartname = msg['name']
  //         console.log(jsonarray)
  //
  //         allcounter = 0
  //       } else {
  //         for (var k = 0; k < msg['value'].length; k++) {
  //           if (msg['value'][k]['yVal'] == null) {
  //             var jsonTemp = { name: msg['name'], value: 0 }
  //           } else {
  //             var jsonTemp = {
  //               name: msg['name'],
  //               value: msg['value'][k]['yVal'],
  //             }
  //           }
  //
  //           counter_jsonarray.push(jsonTemp)
  //         }
  //       }
  //     }
  //   })
  //   .catch(rejected => {
  //     console.log(rejected)
  //     str = rejected
  //   })

  // console.log(str.length)
  //
  // console.log('json arr', jsonarray)
  // console.log(log_counter_jsonarray[0]['value'])
  console.log('log counter', log_counter_jsonarray)

  return (
    <div>
      {/*<div className={styles.sales}>*/}
      {/*<div className={styles.title}>{chartname + '(ms)'}</div>*/}
      {/*<ResponsiveContainer minHeight={360}>*/}
      {/*<LineChart data={jsonarray}>*/}
      {/*<CartesianGrid strokeDasharray="3 3" />*/}
      {/*<XAxis dataKey="xVal" />*/}
      {/*<YAxis />*/}
      {/*<Tooltip />*/}
      {/*<Legend />*/}
      {/*<Line*/}
      {/*type="monotone"*/}
      {/*dataKey="mysql.read.latency"*/}
      {/*stroke="#8884d8"*/}
      {/*/>*/}
      {/*/!*<Line type="monotone" dataKey="mysql.read.error.count" stroke="#82ca9d" />*!/*/}
      {/*</LineChart>*/}
      {/*</ResponsiveContainer>*/}
      {/*</div>*/}

      {/*<div className={styles.sales}>*/}
      {/*<div className={styles.title}>Counters</div>*/}
      {/*<BarChart width={600} height={250} data={counter_jsonarray}>*/}
      {/*<CartesianGrid strokeDasharray="3 3" />*/}
      {/*<XAxis dataKey="name" />*/}
      {/*<YAxis />*/}
      {/*<Tooltip />*/}
      {/*<Legend />*/}
      {/*/!*<Bar dataKey="pv" fill="#8884d8" />*!/*/}
      {/*<Bar dataKey="value" fill="#82ca9d" barSize={30} />*/}
      {/*</BarChart>*/}
      {/*</div>*/}

      <div className={styles.sales}>
        <div className={styles.title}>lrs.log.counter</div>
        <BarChart width={600} height={250} data={log_counter_jsonarray}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width={100} />
          <Tooltip />
          <Legend />
          {/*<Bar dataKey="pv" fill="#8884d8" />*/}
          <Bar dataKey="value" fill="#82ca9d" barSize={30} />
        </BarChart>
      </div>
    </div>
  )
}

Sales.propTypes = {
  data: PropTypes.array,
}

export default Sales
