<template>
  <a-row :gutter="[2, 14]">
    <a-col type="flex" :span="6" v-for="(item, index) in files" :key="index">
      <div class="div-img" style="border-radius: 0.25rem;" @contextmenu.prevent="openMenu($event, item)">
        <img :src="item.fileUrl"
          style="height: 10rem;width: 90%;border-radius: 0.3rem;margin-left: 5%;padding: 0.1rem;box-shadow: 1px 2px 5px #727272;" />
        <div style="height: 5rem;width: 88.7%;position: absolute;margin-left: 5.111%;margin-top: -5.1rem;z-index: 9;border-bottom-left-radius: 0.3rem;padding: 0.1rem;
  border-bottom-right-radius: 0.3rem;  background: linear-gradient(to top,#000000,transparent);">
        </div>
        <div style="height: 1rem;width: 88.7%;position: absolute;margin-left: 5.111%; margin-top: -2.1rem;z-index: 9;color: #ffffff;font-size: .875rem;
   line-height: 1.25rem;padding-left: 1rem;">
          {{
            item.createTime
          }}
        </div>
      </div>
    </a-col>
  </a-row>
  <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
    <!-- <li v-if="rightClickItem.fileType==99" @click="handleClickFolder(rightClickItem)">打开</li>
      <li @click="handleDelete(rightClickItem)">删除</li>
      <li @click="handleDownloadFile(rightClickItem)" v-if="rightClickItem.fileType!=99">下载</li>
      <li @click="handlePreviewFile(rightClickItem)" v-if="rightClickItem.fileType!=99">预览</li>
      <li @click="handleUpdate(rightClickItem)">编辑</li> -->
    <li @click="handleCopyUrl()">复制地址</li>
  </ul>
</template>
<script >
import { defineComponent, onMounted, reactive, toRefs, ref, watch, getCurrentInstance } from 'vue'
import { getAllFiles } from '@/api/api'
import { message } from 'ant-design-vue'
export default defineComponent({
  name: 'depotIndex',
  setup () {
    const data = reactive({
      files: [],
      visible: false,
      top: 0,
      left: 0,
      pic: null
    })
    const visible = ref(false)
    const { proxy } = getCurrentInstance()
    onMounted(function () {
      getFiles()
    })
    // watch: {
    //   visible(value) {
    //     if (value) {
    //       document.body.addEventListener('click', closeMenu)
    //     } else {
    //       document.body.removeEventListener('click', closeMenu)
    //     }
    //   }
    // }
    watch(visible, (newValue, oldValue) => {
      if (visible.value) {
        document.body.addEventListener('click', closeMenu)
      } else {
        document.body.removeEventListener('click', closeMenu)
      }
    })
    function openMenu (e, item) {
      data.pic = item
      const x = e.pageX
      const y = e.pageY
      data.top = y
      data.left = x
      visible.value = true
    }
    const handleCopyUrl = () => {
      proxy.$copyText(data.pic.fileUrl).then(() => {
        message.success('复制成功')
      })
      visible.value = false
    }
    function closeMenu () {
      visible.value = false
    }

    const getFiles = async () => {
      const { data: res } = await getAllFiles()
      if (res.code === 200) {
        data.files = res.data
        console.log(res)
      } else {
        message.error('系统错误')
      }
    }
    return {
      ...toRefs(data),
      openMenu,
      closeMenu,
      handleCopyUrl,
      visible
    }
  }

})
</script>
<style lang="scss" scoped>
.contextmenu {
  // background-clip: padding-box;
  // background-color: #fff;
  // border: 0;
  // border-radius: 6px;
  // box-shadow: 0 5px 10px hsla(0, 0%, 68%, .3);
  // display: none;
  // float: left;
  // font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  // font-size: 14px;
  // left: 0;
  // list-style: none;
  // margin: 2px 0 0;
  // min-width: 160px;
  // padding: 5px 0;
  // position: absolute;
  // text-align: left;
  // top: 100%;
  // z-index: 1000;
  margin: 2px 0 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  box-shadow: 0 5px 10px hsla(0, 0%, 68%, .3);
}

.contextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}

.contextmenu li:hover {
  background: #627aff;
  color: #fff;
}

img:hover {
  // border: 2px solid blue;
  border: 0.1rem #1a73e8 solid;
}
</style>
