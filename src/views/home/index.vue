<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar title="首页" fixed />
    <!-- 导航栏 -->
    <!-- 频道列表 -->
    <!-- animated:切换动画 swipeable：滑动切换 -->
    <van-tabs v-model="active" animated swipeable>
         <!-- 面包菜单按钮 -->
      <div slot="nav-right" class="wap-nav" @click="isChannelShow = true">
        <van-icon name="wap-nav" size="24" />
      </div>
      <!-- /面包菜单按钮 -->
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <van-pull-refresh v-model="channel.isPullDownLoading" @refresh="onRefresh">
          <!--v-model="channel.isPullDownLoading" 控制下拉刷新的 loading 状态
          @refresh 下拉刷新的时候会触发该事件 调用onRefresh方法-->
          <!-- 文章列表 1.1.2 然后在让文章列表绑定每个频道对应的数据
        loading 控制上拉加载更多的 loading 效果
        finished 控制是已加载结束
        finished-text 加载结束的提示文本
        @load="onload" 上拉加载更多触发的事件
          列表组件<van-cell/> 会在初始化的时候自动调用 load 事件调用 onload方法-->
          <van-list
            v-model="channel.loading"
            :finished="channel.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <!-- 列表具体内容
            -->
            <!-- <van-cell
              v-for="article in channel.articles"
              :key="article"
              :title="article"
            />-->
            <!--  v-for中key 必须是字符串或者数字，不能是数组或对象，所以需要转换，
            因为article.art_id超过了安全整数范围被json-bigint转成了对象，但是key只能绑定字符串或者数字，所以这里要把它转为字符串来绑定给这个key-->
            <!-- <van-cell
              v-for="article in channel.articles"
              :key="article.art_id.toString()"
              :title="article.title"
            />-->
            <!-- 展示详细的列表项信息 -->
            <van-cell
              v-for="(article, index) in channel.articles"
              :key="index"
              :title="article.title"
            >
              <div slot="label">
                <van-grid :border="false" :column-num="3">
                  <!-- 文章图片信息 -->
                  <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                    <van-image lazy-load height="80" :src="img" />
                    <!-- lazy-load 图片懒加载直接在wan-image组件中使用即可，如果是普通img标签表图片的src属性换成指令v-lazy即可 v-lazy="图片地址" -->
                  </van-grid-item>
                </van-grid>
                <div class="article-info">
                  <div class="meta">
                    <!-- 文章作者名字 -->
                    <span>{{ article.aut_name }}</span>
                    <!-- 文章评论数量 -->
                    <span>{{ article.comm_count }}评论</span>
                    <!-- 文章发布日期 -->
                    <span>{{ article.pubdate | relativeTime }}</span>
                    <!-- 这里的发布日期的时间我们需要做一下相对事时间处理 用第三方包moment或者day.js都可以
                    前者功能更强大一些 day.js是参照moment 后者的好处就是比moment小很多 这里我们使用day.js
                    使用步骤：
                    1.安装依赖 yarn add dayjs
                    2.然后在utils中新建一个datetime.js专门处理时间的一个js文件 里面做一些配置
                    3.导入dayjs
                    4.导入配置中文语言包
                    5.dayjs.locale('zh-cn')调用中文语言包
                    6.使用插件实现相对时间 RelativeTime（插件）插件也是dayjs的插件直接引入就可以使用了不需要下载
                    7.同样的dayjs.extend(relativeTime) 使用即可 插件的官方文档有说明
                    8.导出这个js文件即可  在这里需要用到的地方引入加载调用即可
                    9.第9步 具体的在处理时间的模块中查看datetime.js中有说明
                    -->
                  </div>
                  <!-- 右侧的小x号图标 不用也可以 -->
                  <van-icon name="close" />
                </div>
              </div>
            </van-cell>
            <!-- 列表具体内容 -->
            <!-- channel.articles 该频道的文章列表
          channel.loading 该频道的加载状态
            channel.finished 该频道的结束状态（加载完成）-->
          </van-list>
        </van-pull-refresh>
        <!-- 文章列表 -->
      </van-tab>
    </van-tabs>
    <!-- 频道列表 -->
    <!-- 频道管理 频道弹窗-->
    <!-- closeable:属性关闭弹层 会在右上角显示一个关闭的图标 -->
    <!-- close-icon-position="top-left": 在左上角关闭弹层 -->
    <!-- 因为要填充内容把单标签设置成双标签 -->
    <van-popup v-model="isChannelShow" round closeable position="bottom" :style="{ height: '95%' }">
      <div class="channel-container">
        <!-- border="false 单元格组件默认有边框 为true -->
        <van-cell title="我的频道" :border="false">
          <van-button
            type="danger"
            size="mini"
            @click="isEditShow = !isEditShow"
          >{{ isEditShow ? '完成' : '编辑' }}</van-button>
        </van-cell>
        <van-grid :gutter="10">
          <van-grid-item text="推荐" @click="switchChannel(0)" />
          <van-grid-item
            v-for="(channel,index) in channels.slice(1)"
            :key="index"
            :text="channel.name"
            @click="onMyChannelClick(index)"
          >
            <van-icon v-show="isEditShow" class="close-icon" slot="icon" name="close" />
          </van-grid-item>
          <!-- 遍历我的频道 我的频道就是上面我们遍历的频道列表 -->
        </van-grid>
        <!-- border="false 单元格组件默认有边框 为true -->
        <van-cell title="推荐频道" :border="false"></van-cell>
        <van-grid :gutter="10">
          <van-grid-item
            v-for="channel in recommendChannels"
            :key="channel.id"
            :text="channel.name"
            @click="addChannel(channel)"
          />
          <!-- 遍历剩余推荐频道渲染到页面上 -->
        </van-grid>
      </div>
    </van-popup>
    <!-- 频道管理 -->
  </div>
</template>

<script>
import { defaultChannels, allChannels } from '@/api/channel' // 调用封装好的默认推荐频道列表接口发请求
import { getArticelsList } from '@/api/articles' // 调用封装好的文章列表接口发请求
import { getItem, setItem } from '@/utils/storage' // 引入本地储存模块 做数据持久化
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0, // 代表着当前频道列表的索引下标（对应的频道被选中）默认0就是第一个频道列表
      //   list: [],
      //   loading: false,
      //   finished: false,
      channels: [], // 定义频道列表
      //   isloading: false
      //   isChannleShow: false // 是否弹出
      isChannelShow: false, // 是否弹出
      allChannels: [], // 存储素有频道列表
      isEditShow: false // 编辑按钮状态
    }
  },
  // 监听频道数据 当数据发生改变，就把数据重新存储到本地存储
  watch: {
    // 函数名就是要监视的数据成员名称
    channels (newVal) {
      //   console.log(newVal)
      setItem('channels', newVal)
    }
  },
  created () {
    this.getChannels() // 频道列表的方法调用
    this.getAllChannels() // 所有频道的方法调用
  },
  methods: {
    //   接口真实数据 上拉加载更多
    async onLoad () {
      // 1.1.3 修改函数 将原来的属性覆盖，重新赋值成新定义的数据
      //   获取当前频道对象
      const activeChannel = this.channels[this.active]
      // 1. 请求获取数据
      const { data } = await getArticelsList({
        channel_id: activeChannel.id, // 频道ID
        // timestamp: Date.now(),
        // timestamp: 1571018288733, // 时间戳 请求新的推荐数据传当前的事件戳 请求历史推荐传指定的时间戳
        timestamp: activeChannel.timestamp || Date.now(), // 请求新的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章 1包含置顶 0不包含
      })
      //   console.log(data)

      // 2. 将数据添加到 当前频道的articles 中
      //   activeChannel.articles = activeChannel.articles.concat(data.data.results)
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
    // 以前的假数据
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
    //     // 3.设置本次加载状态结束
    //     // 每次数据加载完毕，列表组件都会判断数据是否满足一屏了如果当前数据不满足一屏，他就继续 onload调用方法循环加载数据
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
      // 因为我们把数据持久化到了本次存储，所以我们需要在页面初始化的时候优先从本地存储来获取频道数据
      // 首先定义本地一个空数组
      let channels = []
      //   然后读取本地储存的频道
      const loadChannels = getItem('channels')
      // 做判断如果本地储存有数据就从本地储存拿
      // 如果有本地存储的频道列表就使用本地存储的频道列表
      if (loadChannels) {
        channels = loadChannels
        // 如果没有本地存储的频道列表，则请求获取后台推荐的频道列表
      } else {
        const { data } = await defaultChannels()
        channels = data.data.channels
      }
      //   以前的写法 没有从本地储存中拿数据做数据持久化
      // const { data } = await defaultChannels()
      //   console.log(data)

      //  1.展示文章列表
      // 1.1因为每个频道都有一份儿自己的文章列表数据，所以我们首先要将数据进行改造，为每个频道添加自定义数据：文章列表、loading状态、finished 结束状态
      // 1.1.1定制频道的内容数据（请求的接口中添加另外的数据）
      // const channels = data.data.channels // 定义变量接收后台数据 手动加入数据

      // 根据需要扩展自定义数据，用以满足我们的业务需求
      this.extendData(channels)

      //   channels.forEach(channel => {
      //     channel.articles = [] // 存储频道的文章列表
      //     channel.loading = false // 频道的上拉加载更多的 loading 状态
      //     channel.finished = false // 频道的加载结束的状态
      //     channel.timestamp = null // 存储获取频道下一页的时间戳
      //     channel.isPullDownLoading = false // 存储频道的下拉刷新 loading 状态
      //   })
      this.channels = channels // 将服务器中的数据赋值给data中的channels中 然后做循环遍历渲染到页面上，此时频道列表channels数组中的每个频道channel中就会多了一个articles文章列表
      //   channel.articles 是频道列表 在他的外面是一个当前频道对象就是this.channels[this.active]=activeChannel(当前激活的频道对象)
      // }
    },
    // 下拉刷新
    async onRefresh () {
      // console.log('onRefresh') // 测试下拉

      // 获取当期激活的频道对象
      const activeChannel = this.channels[this.active]

      // 1. 请求获取最新推荐的文章列表
      const { data } = await getArticelsList({
        channel_id: activeChannel.id,
        timestamp: Date.now(), // 下拉刷新永远都是在获取最新推荐的文章列表，所以传递当前最新时间戳
        with_top: 1
      })

      // 2. 将数据添加到文章列表顶部
      activeChannel.articles.unshift(...data.data.results)

      // 3. 关闭下拉刷新的 loading 状态
      activeChannel.isPullDownLoading = false

      // 4. 提示
      this.$toast('刷新成功')
    },
    /**
     * 获取所有频道
     */
    async getAllChannels () {
      const { data } = await allChannels()
      const channels = data.data.channels
      //   调用封装的定制频道数据的函数
      this.extendData(channels)
      //   channels.forEach(channel => {
      //     channel.articles = [] // 存储频道的文章列表
      //     channel.finished = false // 存储频道的加载结束状态
      //     channel.loading = false // 存储频道的加载更多的 loading 状态
      //     channel.timestamp = null // 存储获取频道下一页的时间戳
      //     channel.isPullDownLoading = false // 存储频道的下拉刷新 loading 状态
      //   })
      this.allChannels = channels
    },
    // 添加频道  注册点击事件 点击频道的时候调用方法将所点击的频道添加到我的频道中
    addChannel (channel) {
      this.channels.push(channel)
    },
    // 我的频道项点击处理函数
    onMyChannelClick (index) {
      if (this.isEditShow) {
        // 如果是编辑状态，删除频道
        this.channels.splice(index, 1)
      } else {
        // 如果是非编辑状态，切换频道展示
        // 切换当前激活的频道
        // this.active = index

        // 关闭频道弹层
        // this.isChannelShow = false
        // 因为这个数组不包括“推荐”频道，而首页中遍历的频道列表是包括推荐，所以让索引+1
        this.switchChannel(index + 1)
      }
    },
    // 切换频道
    switchChannel (index) {
      this.active = index
      this.isChannelShow = false
    },
    // 封装定制的频道方法因为所有频道与获取推荐频道的时候都定制了频道
    extendData (channels) {
      channels.forEach(channel => {
        channel.articles = [] // 存储频道的文章列表
        channel.finished = false // 存储频道的加载结束状态
        channel.loading = false // 存储频道的加载更多的 loading 状态
        channel.timestamp = null // 存储获取频道下一页的时间戳
        channel.isPullDownLoading = false // 存储频道的下拉刷新 loading 状态
      })
    }
  },
  //   封装计算属性获取剩余推荐频道
  computed: {
    //   获取推荐频道列表
    recommendChannels () {
      // 定义一个空数组接收剩余我的频道
      const arr = []
      this.allChannels.forEach(channel => {
        // 判断 channel 是否存在我的频道中
        // 如果不存在，就证明它是剩余推荐的频道

        // 数组的 find 方法
        // 它会遍历数组，每遍历一次，它就判定 item.id === channel.id
        // 如果 true，则停止遍历，返回满足该条件的元素
        // 如果 false，则继续遍历
        // 如果直到遍历结束都没有找到符合 item.id === channel.id 条件的元素，则返回 undefined
        const res = this.channels.find(item => item.id === channel.id)
        if (!res) {
          arr.push(channel)
        }
      })
      //   return 所有频道 - 我的频道
      return arr
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  .article-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .meta span {
      margin-right: 10px;
    }
  }
  /** 展示频道的菜单按钮 */
  .wap-nav {
    position: sticky;
    right: 0;
    display: flex;
    align-items: center;
    background-color: #fff;
    opacity: 0.8;
  }
/* 标签组件的根节点的类名 */
  .van-tabs /deep/ .van-tabs__wrap--scrollable {
    position: fixed;
    top: 46px;
    left: 0;
    right: 16px;
    z-index: 2;
  }
  .van-tabs /deep/ .van-tabs__content {
    margin-top: 90px;
    margin-bottom: 50px;
  }
  //   让van-cell单元格距图标有一些距离
  .channel-container {
    padding-top: 30px;
  }
  //设置点击编辑之后的icon按钮图标固定在右上角
  .close-icon {
    position: absolute;
    top: -5px;
    right: -5px;
  }
}
</style>
