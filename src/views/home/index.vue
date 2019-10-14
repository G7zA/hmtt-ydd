<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar title="首页" />
    <!-- 导航栏 -->
    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <van-tab
      :title="channel.name"
      v-for="channel in channels" :key="channel.id">
        <!-- 文章列表 -->
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
           @load="onLoad">
          <van-cell
            v-for="item in list"
            :key="item"
            :title="item" />
        </van-list>
        <!-- 文章列表 -->
      </van-tab>
      <!-- <van-tab title="标签 2">内容 2</van-tab>
      <van-tab title="标签 3">内容 3</van-tab>
      <van-tab title="标签 4">内容 4</van-tab> -->
    </van-tabs>
    <!-- 频道列表 -->
  </div>
</template>

<script>
import { defaultChannels } from '@/api/channel' // 调用封装好的默认推荐频道列表接口发请求
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // 代表着当前频道列表的索引下标（对应的频道被选中）
      list: [],
      loading: false,
      finished: false,
      channels: [] // 定义频道列表
    }
  },
  created () {
    this.getChannels()
  },
  methods: {
    onLoad () {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 500)
    },
    // 获取默认推荐频道列表方法
    async getChannels () {
      const { data } = await defaultChannels()
      console.log(data)
      this.channels = data.data.channels // 将服务器中的数据赋值给data中的channels中 然后做循环遍历渲染到页面上
    }
  }
}
</script>

<style>
</style>
