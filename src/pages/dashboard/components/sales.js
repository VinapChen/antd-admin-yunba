import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Color, config } from 'utils'
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
var jsonstr = '[]'

var parseArrDevice0 = ''
var logArrDevice0 = ''
var counterArrDevice0 = ''

var parseArrDevice1 = ''
var logArrDevice1 = ''
var counterArrDevice1 = ''
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
  } else if (timeUnit == 'us') {
    tUnit = 1000
  } else if (timeUnit == 'ms') {
    tUnit = 1
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

function chart_data_format(str) {
  var uploadlat_jsonarray = eval('(' + jsonstr + ')')
  var parselat_jsonarray = eval('(' + jsonstr + ')')
  var counter_jsonarray = eval('(' + jsonstr + ')')

  var logWriteFailCounter = 0
  //json arr 清零
  counter_jsonarray = eval('(' + jsonstr + ')')

  //解析json数据 转换数据
  for (var i = 0; i < str.length; i++) {
    var msg = eval(str[i])

    if (str[i]['name'] == 'parse.log.latency') {
      parselat_jsonarray = latency_data_format('ms', str[i])
      console.log('parse log latency ', parselat_jsonarray)
    } else if (str[i]['name'] == 'log.upload.latency') {
      uploadlat_jsonarray = latency_data_format('ns', str[i])
      console.log('upload log latency', uploadlat_jsonarray)
    } else {
      if (msg['value'][0]['yVal'] == null) {
        var jsonTemp = { name: msg['name'], value: 0 }
      } else {
        var jsonTemp = {
          name: msg['name'],
          value: msg['value'][0]['yVal'],
        }
      }
      counter_jsonarray.push(jsonTemp)

      //计算 log写失败次数
      if (msg['name'] == 'upload.log.counter') {
        logWriteFailCounter = msg['value'][0]['yVal']
      } else if (
        logWriteFailCounter != 0 &&
        msg['name'] == 'log.write.success.counter'
      ) {
        logWriteFailCounter -= msg['value'][0]['yVal']
        console.log('log write fail :', logWriteFailCounter)
        var jsonTemp = {
          name: 'log.write.fail.counter',
          value: logWriteFailCounter,
        }
        counter_jsonarray.push(jsonTemp)
        logWriteFailCounter = 0
      }
    }
  }
  return [parselat_jsonarray, uploadlat_jsonarray, counter_jsonarray]
}

function Sales({ data }) {
  // setTimeout(
  //   function ()
  //   {
  //
  //   console.log("time out");}
  // ,10000);
  // url = 'http://0.0.0.0:8082/vars.do'
  var url = 'http://navlog.gionee.com/vars.do/'
  var url1 = 'http://navlog.gionee.com/vars.do1/'
  // url1 = 'http://t-nav.gionee.com/vars.do'

  fetch(url)
    .then(res => res.json())
    .then(res => {
      // console.log(res)
      str = eval(res['ResultMsg'])
      // console.log('resule msg length', str.length)
      // console.log(str)

      var data = chart_data_format(str)
      console.log('data', data)

      parseArrDevice0 = data[0]
      logArrDevice0 = data[1]
      counterArrDevice0 = data[2]
    })
    .catch(rejected => {
      console.log(rejected)
      str = rejected
    })
  fetch(url1)
    .then(res => res.json())
    .then(res => {
      // console.log(res)
      str = eval(res['ResultMsg'])
      // console.log('resule msg length', str.length)
      // console.log(str)

      var data = chart_data_format(str)
      console.log('data1', data)

      parseArrDevice1 = data[0]
      logArrDevice1 = data[1]
      counterArrDevice1 = data[2]
    })
    .catch(rejected => {
      console.log(rejected)
      str = rejected
    })

  // console.log(str.length)
  //
  // console.log('json arr', jsonarray)
  // console.log(log_counter_jsonarray[0]['value'])
  // console.log('counter json arr', counter_jsonarray)

  return (
    <div>
      <div className={styles.sales}>
        <div className={styles.deviceFont}>
          <img src={config.devicePath} />
          {'Device 0'}
        </div>
        <div className={styles.title}>{'log.upload.latency (ms)'}</div>
        <ResponsiveContainer minHeight={360}>
          <LineChart data={logArrDevice0}>
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
          <LineChart data={parseArrDevice0}>
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
        <BarChart width={600} height={250} data={counterArrDevice0}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width={100} />
          <Tooltip />
          <Legend />
          {/*<Bar dataKey="pv" fill="#8884d8" />*/}
          <Bar dataKey="value" fill="#82ca9d" barSize={35} />
        </BarChart>
      </div>

      <div className={styles.sales}>
        <div className={styles.deviceFont}>
          <img src={config.devicePath} />
          {'Device 1'}
        </div>
        <div className={styles.title}>{'log.upload.latency (ms)'}</div>
        <ResponsiveContainer minHeight={360}>
          <LineChart data={logArrDevice1}>
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
          <LineChart data={parseArrDevice1}>
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
        <BarChart width={600} height={250} data={counterArrDevice1}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width={100} />
          <Tooltip />
          <Legend />
          {/*<Bar dataKey="pv" fill="#8884d8" />*/}
          <Bar dataKey="value" fill="#82ca9d" barSize={35} />
        </BarChart>
      </div>
    </div>
  )
}

Sales.propTypes = {
  data: PropTypes.array,
}

export default Sales
