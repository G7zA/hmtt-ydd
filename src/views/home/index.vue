<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar title="首页" />
    <!-- 导航栏 -->
    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <!-- 文章列表 1.1.2 然后在让文章列表绑定每个频道对应的数据-->
        <van-list
          v-model="channel.loading"
          :finished="channel.finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
        <!-- 具体内容
        v-for中key 必须是字符串或者数字，不能是数组或对象，所以需要转换，因为id超过了安全数字范围被转成了对象-->
          <van-cell
            v-for="article in channel.articles"
            :key="article.art_id.toString()"
            :title="article.title"
          />
          <!-- channel.articles 该频道的文章列表
          channel.loading 该频道的加载状态
          channel.finished 该频道的结束状态（加载完成）-->
        </van-list>
        <!-- 文章列表 -->
      </van-tab>
      <!-- <van-tab title="标签 2">内容 2</van-tab>
      <van-tab title="标签 3">内容 3</van-tab>
      <van-tab title="标签 4">内容 4</van-tab>-->
    </van-tabs>
    <!-- 频道列表 -->
  </div>
</template>

<script>
import { defaultChannels } from '@/api/channel' // 调用封装好的默认推荐频道列表接口发请求
import { getArticelsList } from '@/api/articles' // 调用封装好的文章列表接口发请求
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // 代表着当前频道列表的索引下标（对应的频道被选中）默认0就是第一个频道列表
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
    async onLoad () {
      // 1.1.3 修改函数 将原来的属性覆盖，重新赋值成新定义的数据
      //   获取当前频道对象
      const activeChannel = this.channels[this.active]
      // 1. 请求获取数据
      const { data } = await getArticelsList({
        channel_id: activeChannel.id, // 频道ID
        // timestamp: Date.now(),
        // timestamp: 1571018288733, // 时间戳 请求新的推荐数据传当前的事件戳
        timestamp: activeChannel.timestamp || Date.now(), // 请求新的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章 1包含置顶 0不包含
      })
      console.log(data)

      // 2. 将数据添加到 当前频道的articles 中
      //  activeChannel.articles = activeChannel.articles.concat(data.data.results)
      activeChannel.articles.push(...data.data.results)

      // 3.加载状态结束 结束当前频道的loading = false
      activeChannel.loading = false

      // 4. 判断数据是否已全部加载结束，如果还有下一页数据
      if (data.data.pre_timestamp) {
        // 更新获取下一页数据的页码时间戳
        activeChannel.timestamp = data.data.pre_timestamp
      } else {
        //   如果没有数据了，就意味着没有下一页数据了，将 finish 设置为 true
        activeChannel.finished = true
      }
      // 数据全部加载完成
    },

    // onLoad () {
    //   // 1.1.3 修改函数 将原来的属性覆盖，重新赋值成新定义的数据
    //   //   获取当前频道对象
    //   const activeChannel = this.channels[this.active]
    //   // 异步更新数据
    //   setTimeout(() => {
    //     // 1. 请求获取数据
    //     for (let i = 0; i < 10; i++) {
    //       // 2. 将数据添加到 当前频道的articles 中
    //       activeChannel.articles.push(activeChannel.articles.length + 1)
    //     }
    //     // 3.加载状态结束
    //     activeChannel.loading = false

    //     // 4. 判断数据是否已全部加载结束，如果没有数据了，将 finish 设置为 true
    //     // 数据全部加载完成
    //     if (activeChannel.articles.length >= 40) {
    //       activeChannel.finished = true
    //     }
    //   }, 500)
    // },
    // 获取默认推荐频道列表方法
    async getChannels () {
      const { data } = await defaultChannels()
      //   console.log(data)

      //  1.展示文章列表 用模拟数据
      // 1.1因为每个频道都有一份儿自己的文章列表数据，所以我们首先要将数据进行改造，为每个频道添加自定义数据：文章列表、loading状态、finished 结束状态
      // 1.1.1定制频道的内容数据
      const channels = data.data.channels // 后台数据
      channels.forEach(channel => {
        channel.articles = [] // 频道的文章列表
        channel.loading = false // 频道的上拉加载更多的 loading 状态
        channel.finished = false // 频道的加载结束的状态
        channel.timestamp = null // 存储获取频道下一页的时间戳
      })
      this.channels = data.data.channels // 将服务器中的数据赋值给data中的channels中 然后做循环遍历渲染到页面上
    }
  }
}
</script>

<style>
</style>
