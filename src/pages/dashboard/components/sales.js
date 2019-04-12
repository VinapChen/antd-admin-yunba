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
var uploadlat_jsonarray = eval('(' + jsonstr + ')')
var parselat_jsonarray = eval('(' + jsonstr + ')')
// var counter_jsonstr = '[{"name":"counter","value":0}]'
var counter_jsonarray = eval('(' + jsonstr + ')')
var log_counter_jsonarray = eval('(' + jsonstr + ')')
var chartname = ''

function latency_data_format(timeUnit, json_res) {
  console.log('json_res', json_res)

  var jsonarray = eval('(' + jsonstr + ')')
  var date
  var D = ''
  var T = ''
  var num
  var tUnit = 1

  if (timeUnit == 'ns') {
    tUnit = 1000000
  }

  //找出时间顺序先后的覆盖点
  for (var i = 0; i < json_res['value'].length; i++) {
    if (json_res['value'][i]['xVal'] > json_res['value'][i + 1]['xVal']) {
      num = i + 1
      console.log('num', num)
      break
    }
  }

  //超过max length(jval定义数组大小) 从头覆盖，给数组显示排序，num ~ max length 为发生在前的数据
  for (var j = num; j < json_res['value'].length; j++) {
    date = new Date(json_res['value'][j]['xVal'])
    D =
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '-' +
      (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
      ' '
    T =
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
      ':' +
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
      ':' +
      (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
    var jsonTemp = {
      name: json_res['name'],
      value: json_res['value'][j]['yVal'] / tUnit,
      xVal: D + T,
    }

    jsonarray.push(jsonTemp)
  }
  for (var j = 0; j < num; j++) {
    date = new Date(json_res['value'][j]['xVal'])
    D =
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '-' +
      (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
      ' '
    T =
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
      ':' +
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
      ':' +
      (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
    var jsonTemp = {
      name: json_res['name'],
      value: json_res['value'][j]['yVal'] / tUnit,
      xVal: D + T,
    }

    jsonarray.push(jsonTemp)
  }
  num = 0
  // console.log(json_res['name'],jsonarray)

  return jsonarray
}

function Sales({ data }) {
  // setTimeout(
  //   function ()
  //   {
  //
  //   console.log("time out");}
  // ,10000);
  url = 'http://0.0.0.0:8082/vars.do'
  url1 = 'http://navlog.gionee.com/vars.do/'
  // url1 = 'http://t-nav.gionee.com/vars.do'
  // url = 'http://127.0.0.1:5000/dataReturn'

  fetch(url)
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
    })

  fetch(url1)
    .then(res => res.json())
    .then(res => {
      console.log(res)
      str = eval(res['ResultMsg'])
      console.log('resule msg length', str.length)
      console.log(str)

      var logWriteFailCounter = 0
      //json arr 清零
      counter_jsonarray = eval('(' + jsonstr + ')')

      //解析json数据 转换数据
      for (var i = 0; i < str.length; i++) {
        var msg = eval(str[i])

        if (str[i]['name'] == 'parse.log.latency') {
          parselat_jsonarray = latency_data_format('ms', str[i])
          chartname = msg['name']
          console.log('parse log latency ', parselat_jsonarray)
        } else if (str[i]['name'] == 'log.upload.latency') {
          uploadlat_jsonarray = latency_data_format('ns', str[i])
          console.log('upload log latency', uploadlat_jsonarray)
        } else {
          if (msg['name'] == 'upload.log.counter') {
            logWriteFailCounter = msg['value'][0]['yVal']
          } else if (
            logWriteFailCounter != 0 &&
            msg['name'] == 'log.write.success.counter'
          ) {
            logWriteFailCounter = logWriteFailCounter - msg['value'][0]['yVal']
          }

          if (msg['value'][0]['yVal'] == null) {
            var jsonTemp = { name: msg['name'], value: 0 }
          } else {
            var jsonTemp = {
              name: msg['name'],
              value: msg['value'][0]['yVal'],
            }
          }
          counter_jsonarray.push(jsonTemp)
        }
      }

      // var jsonTemp = {
      //   name: 'log.write.fail.counter',
      //   value: log_counter_jsonarray[0]['value'] - log_counter_jsonarray[1]['value'],
      // }
      // log_counter_jsonarray.push(jsonTemp)
    })
    .catch(rejected => {
      console.log(rejected)
      str = rejected
    })

  // console.log(str.length)
  //
  // console.log('json arr', jsonarray)
  // console.log(log_counter_jsonarray[0]['value'])
  console.log('counter json arr', counter_jsonarray)

  return (
    <div>
      <div className={styles.sales}>
        <div className={styles.title}>{'log.upload.latency (ms)'}</div>
        <ResponsiveContainer minHeight={360}>
          <LineChart data={uploadlat_jsonarray}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="xVal" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.sales}>
        <div className={styles.title}>{'log.parse.latency (ms)'}</div>
        <ResponsiveContainer minHeight={360}>
          <LineChart data={parselat_jsonarray}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="xVal" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.sales}>
        <div className={styles.title}>lrs.log.counter</div>
        <BarChart width={600} height={250} data={counter_jsonarray}>
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
