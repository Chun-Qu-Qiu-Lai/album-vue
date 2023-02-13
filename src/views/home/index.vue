<template>
  <div class="echarts-box">
    <div id="curveEcharts" :style="{ width: '100%', height: '300px' }"></div>
    <div style="display: flex;justify-content: space-around;">
      <div id="circularEcharts" :style="{ width: '40%', height: '300px',  transform: 'scale(0.9)' }"></div>
      <div id="albumEcharts" :style="{ width: '40%', height: '300px' }"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'
import { getCatalogues, getUserInfo, getDownloadOperation, getUploadOperation } from '@/api/api'
import { message } from 'ant-design-vue'
export default defineComponent({
  name: 'homeIndex',
  setup () {
    const echart = echarts
    const data = reactive({
      ablbumInfo: [],
      uploadAndDowloadInfo: [],
      curveData: {
        curveDownloadData: {
          downloadValue: [],
          downloadTime: []
        },
        curveUploadData: {
          uploadValue: [],
          uploadTime: []
        }
      }
    })
    onMounted(function () {
      getAblbumTable()
      getUploadAndDowloadNumber()
      getCurveData()
      initChart()
    })

    onUnmounted(() => {

    })
    const getAblbumTable = async () => {
      const s = []
      const { data: res } = await getCatalogues()
      if (res.code === 200) {
        for (let index = 0; index < res.data.length; index++) {
          const temp = { value: null, name: '' }
          temp.value = res.data[index].count
          temp.name = res.data[index].name
          s.push(temp)
        }
        data.ablbumInfo = s
      }
      initChart()
    }
    const getUploadAndDowloadNumber = async () => {
      const s = []
      const { data: res } = await getUserInfo()
      if (res.code === 200) {
        for (let index = 0; index < 2; index++) {
          const temp = { value: null, name: '' }
          if (index === 0) {
            temp.value = res.data.userInfo.downloadNumber
            temp.name = '下载总数'
          } else {
            temp.value = res.data.userInfo.uploadNumber
            temp.name = '上传总数'
          }
          s.push(temp)
        }
        data.uploadAndDowloadInfo = s
      }
      initChart()
    }

    const getCurveData = async () => {
      const { data: res1 } = await getDownloadOperation()
      if (res1.code === 200) {
        data.curveData.curveDownloadData = res1.data
      } else {
        message.error('系统出错')
      }
      const { data: res2 } = await getUploadOperation()
      if (res2.code === 200) {
        data.curveData.curveUploadData = res2.data
      } else {
        message.error('系统出错')
      }
      initChart()
    }

    // 初始化图表
    const initChart = () => {
      // 曲线图
      const curveEcharts = echart.init(document.getElementById('curveEcharts'))
      curveEcharts.setOption({
        title: {
          text: '上传（下载）数量曲线分析',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        xAxis: {
          name: '日期',
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          data: data.curveData.curveDownloadData.downloadTime
        },
        yAxis: {
          name: '数量',
          type: 'value',
          axisLabel: {
            formatter: '{value} 次'
          }
        },
        series: [
          {
            name: '上传总数',
            type: 'line',
            stack: 'x',
            data: data.curveData.curveUploadData.uploadValue,
            areaStyle: {}
          },
          {
            name: '下载总数',
            type: 'line',
            stack: 'x',
            data: data.curveData.curveDownloadData.downloadValue,
            areaStyle: {}
          }
        ]
      })
      // 饼图
      const circularEcharts = echart.init(document.getElementById('circularEcharts'))
      circularEcharts.setOption({
        title: {
          text: '上传（下载）比例分析',
          left: 'center'
        },
        tooltip: {
          igger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            label: {
            },
            data: data.uploadAndDowloadInfo
          }
        ]
      })
      // 饼图
      const albumEcharts = echart.init(document.getElementById('albumEcharts'))
      albumEcharts.setOption({
        title: {
          text: '相册数据分布分析',
          left: 'center'
        },
        tooltip: {
          formatter: '{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            label: {
            },
            data: data.ablbumInfo
          }
        ]
      })
      window.onresize = function () {
        curveEcharts.resize()
        circularEcharts.resize()
        albumEcharts.resize()
      }
    }

    return {
      initChart,
      getAblbumTable,
      getUploadAndDowloadNumber,
      getCurveData
    }
  }
})
</script>

<style scoped lang="scss">

</style>
