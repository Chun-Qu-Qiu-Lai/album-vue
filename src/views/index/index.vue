<template>
  <a-layout has-sider>
    <a-layout-sider :collapsed="store.state.collapsed"
      :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }">
      <div class="logo" v-if="!store.state.collapsed">
        <img src="@/assets/images/icon.png" alt="" style="width:200px">
      </div>
      <div v-else style="display: flex;justify-content: center;">
        <img src="@/assets/images/logo.png" alt="" style="width: 62px;">
      </div>
      <a-menu v-model:selectedKeys="data.selectedKeys" mode="inline" :open-keys="data.openKeys"
        @openChange="onOpenChange">
        <a-menu-item v-for="item in noChildren" :key="item.lable" @click="clickMenu(item.path)">
          <template v-if="`${item.lable}==='仪表盘'`" #icon>
            <pie-chart-two-tone />
          </template>
          <span>{{ item.lable }}</span>
        </a-menu-item>
        <a-sub-menu v-for="item in hasChildren" :key="item.lable">
          <template v-if="`${item.lable}` === '图床管理'" #icon>
            <folder-open-two-tone />
          </template>
          <template v-else-if="`${item.lable}` === '我的图库'" #icon>
            <tags-two-tone />
          </template>
          <template v-else-if="`${item.lable}` === '相册列表'" #icon>
            <tags-two-tone />
          </template>

          <template v-else-if="`${item.lable}` === '用户管理'" #icon>
            <tags-two-tone />
          </template>
          <template #title>{{ item.lable }}</template>
          <a-menu-item v-for="childrenItem in item.children" :key="childrenItem.lable"
            @click="clickMenu(childrenItem.path)">
            <span>{{ childrenItem.lable }}</span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
      <div v-if="!store.state.collapsed" @click="collapsibleMenu()"
        style="width: 100%;background-color: aliceblue;position: absolute;bottom: 0px;align-items: center;display: flex;justify-content: center;padding: 15px 0px;">
        <left-outlined style="transform:scale(1.3);color: #020d14;" />
      </div>
      <div v-else @click="collapsibleMenu()"
        style="width: 100%;background-color: aliceblue;position: absolute;bottom: 0px;align-items: center;display: flex;justify-content: center;padding: 15px 0px;">
        <right-outlined style="transform:scale(1.3);color: #020d14;" />
      </div>
    </a-layout-sider>
    <a-layout :style="{ marginLeft: store.state.collapsed ? '80px' : '200px', transition: '0.3s' }">
      <a-layout-header :style="{ background: 'rgba(255,255,255,0.1)', padding: '8px 10px 8px 10px' }">
        <div
          style="display: flex;justify-content: space-between;width: 95%;background: rgba(62, 59, 67,0.1);padding: 3px 10px;border-radius: 5px;margin: 0 auto;">
          <div style="text-align: center;display: flex;line-height: 50px;">{{ data.username }}</div>
          <div @click="signout()" class="signout"
            style="height: 100%;line-height: 50px;padding: 0px 20px;color: #000000;background-color: #fff;border-radius: 4px;cursor: pointer;  transition: .3s;">
            退出</div>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '0 6px', padding: '20px' }">
        <div
          style="width: 95%;background-color: rgba(254, 227, 218,0.6);margin: 0 auto;border-radius: 10px;min-height: 85vh;padding: 1rem .5rem;">
          <router-view></router-view>
        </div>

      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import { defineComponent, reactive, computed, onMounted } from 'vue'
import { FolderOpenTwoTone, PieChartTwoTone, TagsTwoTone, RightOutlined, LeftOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { clearToken } from '@/utils/token'
import { message } from 'ant-design-vue'
import { getUserInfo } from '@/api/api'
export default defineComponent({
  name: 'indexIndex',
  components: {
    FolderOpenTwoTone,
    PieChartTwoTone,
    TagsTwoTone,
    RightOutlined,
    LeftOutlined
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const menuList = [{
      lable: '仪表盘',
      icon: <pie-chart-two-tone />,
      path: '/home'
    }, {
      lable: '图床管理',
      icon: <folder-open-two-tone />,
      children: [{
        lable: '我的图库',
        path: '/albumAdmin/depot'
      }, {
        lable: '相册列表',
        path: '/albumAdmin/albumList'
      }, {
        lable: '接口使用',
        path: '/albumAdmin/apiuse'
      }]
    }, {
      lable: '用户管理',
      icon: <tags-two-tone />,
      children: [
        {
          lable: '密码修改',
          path: '/userAdmin/updatePsw'
        }
      ]
    }]

    const data = reactive({
      rootSubmenuKeys: ['文件管理', '用户管理'],
      openKeys: [],
      selectedKeys: ['1'],
      username: ''
    })
    onMounted(function () {
      getUsername()
    })
    // 菜单计算
    const noChildren = computed(function () {
      return menuList.filter(item => !item.children)
    })
    const hasChildren = computed(function () {
      return menuList.filter(item => item.children)
    })
    // 点击菜单
    const clickMenu = (path) => {
      router.push({
        path: path
      })
    }
    // 菜单配置
    const onOpenChange = openKeys => {
      const latestOpenKey = openKeys.find(key => data.openKeys.indexOf(key) === -1)
      if (data.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        data.openKeys = openKeys
      } else {
        data.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    }
    // 折叠菜单
    const collapsibleMenu = () => {
      store.state.collapsed = !store.state.collapsed
    }
    // 退出
    const signout = () => {
      clearToken()
      router.push({
        path: 'login'
      })
      message.success('退出成功')
    }
    // 获取用户名
    const getUsername = async () => {
      const { data: res } = await getUserInfo()
      if (res.code === 200) {
        data.username = res.data.userInfo.nickName
      }
    }
    return {
      // ...toRefs(data),
      data,
      onOpenChange,
      menuList,
      noChildren,
      hasChildren,
      clickMenu,
      collapsibleMenu,
      store,
      signout,
      getUsername
    }
  }
})
</script>
<style scoped lang="scss">
body,
html {
  background-color: #db0c0c;
}

#components-layout-demo-fixed-sider .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}

aside {
  padding: 0;
  background-color: #eef1f6 !important;
  background-color: #fff !important;
  margin: 0px !important;
  padding: 0px !important;
}

.signout:hover {
  background-color: #575555 !important;
  color: #ffffff !important;
  box-shadow: 5px 5px 6px #0003;
}

.ant-layout-sider {
  overflow-x: hidden !important;
}
</style>
