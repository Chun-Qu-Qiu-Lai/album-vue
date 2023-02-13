<template>
  <div style="display: flex;align-items: center;justify-content: space-around;padding: 20px 20px;"><a-button
      type="primary" @click="updataModelVisible()">新建相册</a-button></div>
  <a-table :columns="columns" :data-source="data.AblbumTables" class="components-table-demo-nested"
    @expand="expandDetails" :expandedRowKeys="data.expandedRowKeys" @expandedRowsChange="expandedRowsChange">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'status'">
        <a-tag color="blue">正常</a-tag>
      </template>
      <template v-if="column.key === 'operation'">
        <a-popconfirm v-if="data.AblbumTables.length" title="会删除相册内所有图片" ok-text="确认" cancel-text="取消"
          @confirm="deleteAblbum(record.catalogueId)">
          <a-button type="primary" danger>删除</a-button>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a-button type="primary" @click="openUpdateAlbumNameModel(record.catalogueId)">修改</a-button>
        <a-divider type="vertical" />
        <a-upload @change="handleChange" v-model:file-list="data.fileList" name="file" :action="data.host"
          :data="data.signaturesignatureFormData" :showUploadList="false" :maxCount=1 :beforeUpload="beforeUpload"
          accept="image/png, image/jpeg, image/jpg">
          <a-button type="primary" @click="updateUploadCatalogue(record.catalogueId)">
            <upload-outlined></upload-outlined>
            上传
          </a-button>
        </a-upload>

      </template>
    </template>
    <template #expandedRowRender>
      <a-table :row-selection="rowSelection" :columns="innerColumns" :data-source="data.innerData" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'fileUrl'">
            <img :src="record.fileUrl" alt="" style="width: 60px;" />
          </template>
          <template v-if="column.key === 'size'">
            <span>
              {{ record.size }}MB
            </span>
          </template>
          <template v-if="column.key === 'status'">
            <span>
              <a-badge status="success" />
              正常
            </span>
          </template>
          <template v-else-if="column.key === 'operation'">
            <span class="table-operation">
              <a class="ant-dropdown-link" @click="openHighHandleModel(record.filePath, record.fileUrl)"
                style="color: #1890ff;">高级处理</a>
              <a-divider type="vertical" />
              <a class="ant-dropdown-link" @click="openEditPicModel(record.fileUrl)" style="color: #1890ff;">图片处理</a>
              <a-divider type="vertical" />
              <a class="ant-dropdown-link" :href="record.fileUrl" @click="download(record.fileId)">下载</a>
              <a-divider type="vertical" />
              <a-popconfirm v-if="data.AblbumTables.length" placement="left" title="确认删除？" ok-text="确认" cancel-text="取消"
                @confirm="deletePic(record)">
                <a style="color: red;">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </template>
      </a-table>
    </template>
  </a-table>
  <!-- 创建相册表单 -->
  <a-modal width="400px" v-model:visible="data.formModelVisible" @ok="createAlbum()" :closable="false" ok-text="创建"
    cancel-text="取消">
    <a-form>
      <a-form-item label="相册名称" name="albumName">
        <a-input v-model:value="data.albumName">
        </a-input>
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 上传图片进度条 -->
  <a-modal :destroyOnClose="true" :centered="true" width="80px" :visible="data.progressModelVisible"
    :bodyStyle="{ 'background-color': 'rgba(0,0,0,0.47)', padding: '0px', display: 'flex', 'align-items': 'center', 'text-align': 'center' }"
    :footer="null" :closable="false" :maskClosable="false">
    <a-progress type="circle" :percent="data.uploadPercent" :width="80" />
  </a-modal>
  <!-- 修改相册名称 -->
  <a-modal :destroyOnClose="true" width="400px" v-model:visible="data.albumNameModelVisible" @ok="changeAlbumName()"
    :closable="false" ok-text="修改" cancel-text="取消">
    <a-form>
      <a-form-item label="新相册名称" name="newAlbumName">
        <a-input v-model:value="data.newAlbumName">
        </a-input>
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 图片处理 -->
  <a-modal style="top: 20px" :width="1200" v-model:visible="data.editPicModelVisible" ok-text="确认" cancel-text="取消"
    :footer="null" @ok="submitEditPicForm">
    <div class="cut">
      <div class="test test1">
        <vueCropper ref="cropper" :img="data.picOption.img" :outputSize="data.picOption.size"
          :outputType="data.picOption.outputType" :info="true" :full="data.picOption.full"
          :canMove="data.picOption.canMove" :canMoveBox="data.picOption.canMoveBox" :fixedBox="data.picOption.fixedBox"
          :original="data.picOption.original" :autoCrop="data.picOption.autoCrop"
          :autoCropWidth="data.picOption.autoCropWidth" :autoCropHeight="data.picOption.autoCropHeight"
          :centerBox="data.picOption.centerBox" :high="data.picOption.high" :infoTrue="data.picOption.infoTrue"
          @realTime="realTime" @imgLoad="imgLoad" @cropMoving="cropMoving" :enlarge="data.picOption.enlarge">
        </vueCropper>
      </div>
      <!--
      <p>截图框大小</p>
      <div class="show-preview" :style="{
        'width': data.previews.w + 'px', 'height': data.previews.h + 'px', 'overflow': 'hidden',
        'margin': '5px'
      }">
        <div :style="data.previews.div">
          <img :src="data.previews.url" :style="data.previews.img">
        </div>
      </div>

      <p>中等大小</p>
      <div :style="previewStyle1">
        <div :style="data.previews.div">
          <img :src="data.previews.url" :style="data.previews.img">
        </div>
      </div>

      <p>迷你大小</p>
      <div :style="previewStyle2">
        <div :style="data.previews.div">
          <img :src="data.previews.url" :style="data.previews.img">
        </div>
      </div> -->

      <div style="">
        <!-- <label class="c-item">
          <input id="s2" type="checkbox" v-model="data.picOption.original">
          <span>上传图片是否显示原始宽高 (针对大图 可以铺满)</span>
        </label> -->
        <label class="c-item">
          <input type="checkbox" v-model="data.picOption.high">
          <span>是否根据dpr生成适合屏幕的高清图片</span>
        </label>
        <label class="c-item">
          <input type="checkbox" v-model="data.picOption.full">
          <span>是否输出原图比例的截图</span>
        </label>
        <label class="c-item">
          <input type="checkbox" v-model="data.picOption.infoTrue">
          <span>截图信息展示是否是真实的输出宽高</span>
        </label>
        <label class="c-item">
          <input type="checkbox" v-model="data.picOption.canMove">
          <span>能否拖动图片</span>
        </label>
        <label class="c-item">
          <input type="checkbox" v-model="data.picOption.canMoveBox">
          <span>能否拖动截图框</span>
        </label>
        <label class="c-item">
          <input type="checkbox" v-model="data.picOption.fixedBox">
          <span>截图框固定大小</span>
        </label>
        <label class="c-item">
          <input type="checkbox" v-model="data.picOption.autoCrop">
          <span>是否自动生成截图框</span>
        </label>
        <label class="c-item">
          <input type="checkbox" v-model="data.picOption.centerBox">
          <span>截图框是否限制在图片里(只有在自动生成截图框时才能生效)</span>
        </label>
        <label class="c-item">
          <input type="number" v-model="data.picOption.enlarge">
          <span>是否按照截图框比例输出</span>
        </label>

        <label style="max-width: 800px;margin-top: 20px;display: flex;">
          <p style="user-select: none;font-size: 15px;font-weight: 600;letter-spacing: 2px;">输出图片格式</p>
          <div style="display: flex;justify-content: space-around;width: 50%;">
            <label>.png <input type="radio" name="type" value="png" v-model="data.picOption.outputType"></label>
            <label>.jpg <input type="radio" name="type" value="jpeg" v-model="data.picOption.outputType"></label>
            <label>.webp <input type="radio" name="type" value="webp" v-model="data.picOption.outputType"></label>
          </div>
        </label>
      </div>
      <!-- <codes>
        <div slot="body">{{ code1 }}</div>
      </codes> -->
    </div>
    <div class="list-button"
      style="height: 60px;display: flex;justify-content: space-around;width: 100%;padding: 3px 0px;">
      <!-- 在list里面切换图片 <a-button type="primary" @click="changeImg" class="btn">changeImg</a-button> -->
      <!-- 从硬盘选择图片 <a-button type="primary"> <label for="uploads">重新选择</label></a-button> -->
      <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);"
        accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
      <div @click="startCrop" style="display: flex;flex-direction: column;
        text-align: center;justify-content: space-around;align-items: center;" v-if="!data.crap">
        <img src="@/assets/images/editPic/1.png" alt="" style="width: 30px;">
        <div>十字光标</div>
      </div>
      <div @click="stopCrop" style="display: flex;flex-direction: column;
        text-align: center;justify-content: space-around;align-items: center;" v-else>
        <img src="@/assets/images/editPic/1.png" alt="" style="width: 30px;">
        <div>移动光标</div>
      </div>
      <div @click="clearCrop" style="display: flex;flex-direction: column;
        text-align: center;justify-content: space-around;align-items: center;">
        <img src="@/assets/images/editPic/2.png" alt="" style="width: 30px;">
        <div>清空</div>
      </div>
      <div @click="refreshCrop" style="display: flex;flex-direction: column;
        text-align: center;justify-content: space-around;align-items: center;">
        <img src="@/assets/images/editPic/3.png" alt="" style="width: 30px;">
        <div>刷新</div>
      </div>
      <div @click="changeScale(1)" style="display: flex;flex-direction: column;
        text-align: center;justify-content: space-around;align-items: center;">
        <img src="@/assets/images/editPic/4.png" alt="" style="width: 30px;">
        <div>放大</div>
      </div>
      <div @click="changeScale(-1)" style="display: flex;flex-direction: column;
        text-align: center;justify-content: space-around;align-items: center;">
        <img src="@/assets/images/editPic/5.png" alt="" style="width: 30px;">
        <div>缩小</div>
      </div>
      <div @click="rotateLeft" style="display: flex;flex-direction: column;
        text-align: center;justify-content: space-around;align-items: center;">
        <img src="@/assets/images/editPic/6.png" alt="" style="width: 30px;">
        <div>左旋转</div>
      </div>
      <div @click="rotateRight" style="display: flex;flex-direction: column;
        text-align: center;justify-content: space-around;align-items: center;">
        <img src="@/assets/images/editPic/7.png" alt="" style="width: 30px;">
        <div>右旋转</div>
      </div>
      <div @click="finish('base64')" style="display: flex;flex-direction: column;
        text-align: center;justify-content: space-around;align-items: center;">
        <img src="@/assets/images/editPic/8.png" alt="" style="width: 30px;">
        <div>预览(base64)</div>
      </div>
      <div @click="finish('blob')" style="display: flex;flex-direction: column;
        text-align: center;justify-content: space-around;align-items: center;">
        <img src="@/assets/images/editPic/8.png" alt="" style="width: 30px;">
        <div>预览(blob)</div>
      </div>
      <div style="display: flex;flex-direction: column;
        text-align: center;justify-content:space-around;align-items: center;">
        <img src="@/assets/images/editPic/9.png" alt="" style="width: 30px;">
        <div><a @click="down('base64')">下载(base64)</a></div>
      </div>
      <div style="display: flex;flex-direction: column;
        text-align: center;justify-content: space-around;align-items: center;">
        <img src="@/assets/images/editPic/9.png" alt="" style="width: 30px;">
        <div><a @click="down('blob')">下载(blob)</a></div>
      </div>
      <a :href="!data.downImg" download="demo.png" ref="downloadDom"></a>
    </div>
  </a-modal>
  <!-- 预览图片 -->
  <a-modal :width="0" v-model:visible="data.previewModelVisible" :centered="true" :bodyStyle="{}" :footer="null"
    :closable="false">
    <img :src="data.modelSrc" alt="">
  </a-modal>
  <!-- 高级处理 -->
  <a-modal @cancel="cancelHighHandle" :destroyOnClose="true" style="top: 0px" ok-text="确认修改" cancel-text="取消"
    @ok="submitHighHandleForm" :width="1400" title="高级处理" v-model:visible="data.highHandleModelVisible" :centered="true"
    :bodyStyle="{ padding: '5px 0px' }">
    <a-spin :spinning="data.spinning" tip="处理中">
      <div style="display: flex;justify-content: space-around;width: 1400px;align-items: center;padding: 0px 5px;">
        <div
          style="width:300px;height: 300px;display: flex;align-items: center;justify-content: space-around;flex-direction: column;">
          <img :src="data.fileUrl" alt="" style="width:300px;height: 300px;">
          <a-button type="primary" :disabled="data.dowDisabled" style="margin-top: 10px;">
            <a :href="data.fileUrl">下载</a>
          </a-button>
        </div>
        <div style="display: inline-block;background-color: #1890ff;height:70vh;width: 1px;"></div>
        <div style="padding: 0px 5px;width: 360px;">
          <p>效果</p>
          <a-form-item label="亮度" name="username">
            <a-slider v-model:value="data.highHandleForm.bright" :min="-100" :max="100" />
          </a-form-item>
          <a-form-item label="对比度" name="username">
            <a-slider v-model:value="data.highHandleForm.contrast" :min="-100" :max="100" />
          </a-form-item>
          <a-form-item label="图片锐化" name="username">
            <a-switch v-model:checked="data.highHandleForm.sharpenVisible" />
            <a-slider :disabled="!data.highHandleForm.sharpenVisible" v-model:value="data.highHandleForm.sharpen"
              :min="50" :max="399" />
          </a-form-item>
          <a-form-item label="图片模糊" name="username">
            <a-switch v-model:checked="data.highHandleForm.blurVisible" />
          </a-form-item>
          <a-form-item label="模糊半径" name="username">
            <a-slider :disabled="!data.highHandleForm.blurVisible" v-model:value="data.highHandleForm.blurRadius"
              :min="1" :max="50" />
          </a-form-item>
          <a-form-item label="模糊标准差" name="username">
            <a-slider :disabled="!data.highHandleForm.blurVisible" v-model:value="data.highHandleForm.blurStandard"
              :min="1" :max="50" />
          </a-form-item>
          <a-form-item label="图片旋转" name="username">
            <a-slider v-model:value="data.highHandleForm.rotate" :min="0" :max="360" />
          </a-form-item>
        </div>
        <div style="display: inline-block;background-color: #1890ff;height:70vh;width: 1px;"></div>
        <div style="padding: 0px 5px;width: 360px;">
          <a-form-item label="图片水印" name="username">
            <a-switch v-model:checked="data.highHandleForm.watermarkVisible" />
          </a-form-item>
          <div style="width: 100%;" v-show="data.highHandleForm.watermarkVisible">
            <a-form-item label="水印文字内容" name="username">
              <a-input v-model:value="data.highHandleForm.text" show-count :maxlength="15" />
            </a-form-item>
            <a-form-item label="水印文字字体" name="username">
              <a-select @change="typeChange" v-model:value="data.highHandleForm.type" style="width: 150px"
                :options="data.textStyleOption"></a-select>
              <a-input-number v-model:value="data.highHandleForm.size">
                <template #addonAfter>
                  px
                </template></a-input-number>
            </a-form-item>
            <a-form-item label="文字颜色" name="username">
              <color-picker v-model:pureColor="data.color" :zIndex="100000" pickerType="chrome" format="hex6"
                shape="circle" />
            </a-form-item>

            <a-form-item label="文字旋转" name="username">
              <a-slider v-model:value="data.highHandleForm.textRotate" :min="0" :max="360" />
            </a-form-item>
            <a-form-item label="文字铺满" name="username">
              <a-switch v-model:checked="data.highHandleForm.fill" />
            </a-form-item>
            <a-form-item label="文字阴影" name="username">
              <a-switch v-model:checked="data.highHandleForm.shadowVisible" />
            </a-form-item>
            <a-form-item label="阴影透明度" name="username">
              <a-slider :disabled="!data.highHandleForm.shadowVisible" v-model:value="data.highHandleForm.shadow"
                :min="0" :max="100" />
            </a-form-item>
            <a-form-item label="水印透明度" name="username">
              <a-slider v-model:value="data.highHandleForm.opacity" :min="0" :max="100" />
            </a-form-item>
            <a-form-item label="水印位置" name="username">
              <a-select v-model:value="data.highHandleForm.position" style="width: 150px"
                :options="data.textPosition"></a-select>
            </a-form-item>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  getCatalogues,
  getPicTable,
  addAlbum,
  getSignature,
  deletePicture,
  updateAlbumName,
  downloadFile,
  deleteCatalogue,
  deletePictures,
  editHighHandle
} from '@/api/api'
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  computed,
  unref
} from 'vue'
// import 'vue-cropper/dist/index.css'
import 'vue3-colorpicker/style.css'
import { VueCropper } from 'vue-cropper'
import { useStore } from 'vuex'
const columns = [{
  title: '序号',
  dataIndex: 'index',
  key: 'index',
  align: 'center',
  customRender: (text, record, index) => `${text.index + 1}` // 此处为重点
}, {
  title: '相册名称',
  dataIndex: 'name',
  key: 'name',
  align: 'center'
}, {
  title: '照片数量',
  dataIndex: 'count',
  key: 'count',
  align: 'center'
}, {
  title: '创建时间',
  dataIndex: 'createTime',
  key: 'createTime',
  align: 'center'
}, {
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  align: 'center'
}, {
  title: '操作',
  dataIndex: 'operation',
  key: 'operation',
  align: 'center'
}]
const innerColumns = [{
  title: '序号',
  dataIndex: 'key',
  key: 'key',
  align: 'center',
  customRender: (text, record, index) => `${text.index + 1}`// 此处为重点
},
{
  title: '缩略图',
  dataIndex: 'fileUrl',
  key: 'fileUrl',
  align: 'center'
},
{
  title: '宽度',
  dataIndex: 'width',
  key: 'width',
  align: 'center'
}, {
  title: '高度',
  dataIndex: 'height',
  key: 'height',
  align: 'center'
}, {
  title: '内存大小',
  dataIndex: 'size',
  key: 'size',
  align: 'center'
}, {
  title: '图片类型',
  dataIndex: 'type',
  key: 'type',
  align: 'center'
}, {
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  align: 'center'
}, {
  title: '上传时间',
  dataIndex: 'createTime',
  key: 'createTime',
  align: 'center'
}, {
  title: '操作',
  dataIndex: 'operation',
  key: 'operation',
  align: 'center'
}]
export default defineComponent({
  components: {
    UploadOutlined,
    VueCropper
  },
  name: 'listIndex',
  setup () {
    const store = useStore()
    const cropper = ref(null)
    const data = reactive({
      // loading
      spinning: false,
      // 相册列表
      AblbumTables: [],
      // 展开的相册
      expandedRowKeys: [],
      // 子表格图片列表
      innerData: [],
      // 打开表单
      formModelVisible: false,
      // 打开进度条
      progressModelVisible: false,
      // 打开修改相册名称
      albumNameModelVisible: false,
      // 打开高级图像处理
      highHandleModelVisible: false,
      // 打开图片处理
      editPicModelVisible: false,
      // 启用高级处理后的下载按钮
      dowDisabled: true,
      // 创建相册表单
      albumName: '',
      // 图片上传
      fileList: [],
      // 当前展开目录id
      catalogueId: '',
      // 签名信息
      signaturesignatureFormData: {
        key: '',
        policy: '',
        OSSAccessKeyId: 'LTAI5tNaT4y5Ta2YVh6YpU82',
        success_action_status: '200',
        callback: '',
        signature: ''
      },
      // oss服务地址
      host: '',
      // 上传进度
      uploadPercent: 0,
      // 消除进度会出现两次的bug
      countBug: 0,
      // 修改相册名称
      newAlbumName: '',
      // 当前修改相册名称的目录id
      nowUpdateAlbumNameCatalogueId: null,
      // 图片处理信息
      picOption: {
        img: 'https://oss-zscyun.oss-cn-beijing.aliyuncs.com/8356083440779264/8356126918705152/835678258328371220230130.png', // 裁剪图片的地址 url 地址, base64, blob
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式 jpeg, png, webp
        info: true, // 裁剪框的大小信息
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 345, // 默认生成截图框宽度
        autoCropHeight: 245, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例 [ 宽度 , 高度 ]
        canMove: true, // 上传图片是否可以移动
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        full: true, // 是否输出原图比例的截图
        enlarge: '1', // 图片根据截图框输出比例倍数
        mode: 'contain' // 图片默认渲染方式 contain , cover, 100px, 100% auto
      },
      previews: {},
      crap: false,
      lists: [
        {
          img: 'https://avatars2.githubusercontent.com/u/15681693?s=460&v=4'
        }
      ],
      modelSrc: '',
      downImg: '',
      previewModelVisible: false,
      previewModelWidth: null,
      selectedRowKeys: [],
      fileUrl: '',
      highHandleForm: {
        // 亮度
        bright: 0,
        // 对比度
        contrast: 0,
        // 是否锐化
        sharpenVisible: false,
        // 锐化度
        sharpen: 100,
        // 是否模糊
        blurVisible: false,
        // 模糊半径
        blurRadius: 5,
        // 模糊标准差
        blurStandard: 5,
        // 图片旋转
        rotate: 0,
        // 是否水印
        watermarkVisible: false,
        // 水印文字内容
        text: '',
        // 水印文字字体
        type: '使用默认字体',
        // 字体大小
        size: 40,
        // 文字颜色
        color: '#000000',
        // 文字旋转
        textRotate: 0,
        // 文字铺满
        fill: false,
        // 是否文字阴影
        shadowVisible: false,
        // 阴影
        shadow: 100,
        // 水印透明度
        opacity: 100,
        // 水印位置
        position: '中部',
        filePath: ''
      },
      textStyleOption: [
        {
          value: 'd3F5LXplbmhlaQ',
          label: '使用默认字体'
        }, {
          value: 'd3F5LW1pY3JvaGVp',
          label: '文泉微米黑'
        }, {
          value: 'ZmFuZ3poZW5nc2h1c29uZw',
          label: '方正书宋'
        },
        {
          value: 'ZmFuZ3poZW5na2FpdGk',
          label: '方正楷体'
        },
        {
          value: 'ZmFuZ3poZW5naGVpdGk',
          label: '方正黑体'
        },
        {
          value: 'ZmFuZ3poZW5nZmFuZ3Nvbmc',
          label: '方正仿宋'
        },
        {
          value: 'ZHJvaWRzYW5zZmFsbGJhY2s',
          label: 'DroidSans Fallback'
        }
      ],
      textPosition: [{
        value: 'nw',
        label: '左上'
      },
      {
        value: 'north',
        label: '中上'
      }, {
        value: 'ne',
        label: '右上'
      }, {
        value: 'west',
        label: '左中'
      },
      {
        value: 'center',
        label: '中部'
      },
      {
        value: 'east',
        label: '右中'
      },
      {
        value: 'sw',
        label: '左下'
      },
      {
        value: 'south',
        label: '中下'
      },
      {
        value: 'se',
        label: '右下'
      }],
      fileId: null
    })
    onMounted(function () {
      getAblbumTable()
    })
    // 处理表单数据
    const typeChange = (value) => {
    }
    // 提交估计处理表单
    const submitHighHandleForm = async () => {
      data.spinning = true
      if (data.highHandleForm.color.length > 6) {
        data.highHandleForm.color = data.highHandleForm.color.slice(1)
      }
      const { data: res } = await editHighHandle(data.highHandleForm)
      if (res.code === 200) {
        data.fileUrl = res.data
        data.dowDisabled = false
        data.spinning = false
        message.success('修改成功')
      }
    }
    const cancelHighHandle = () => {
      data.highHandleForm.bright = 0
      data.highHandleForm.contrast = 0
      data.highHandleForm.sharpenVisible = false
      data.highHandleForm.sharpen = 100
      data.highHandleForm.blurVisible = false
      data.highHandleForm.blurRadius = 5
      data.highHandleForm.blurStandard = 5
      data.highHandleForm.rotate = 0
      data.highHandleForm.watermarkVisible = false
      data.highHandleForm.text = ''
      data.highHandleForm.type = '使用默认字体'
      data.highHandleForm.size = 40
      data.highHandleForm.color = '#000000'
      data.highHandleForm.textRotate = 0
      data.highHandleForm.fill = false
      data.highHandleForm.shadowVisible = false
      data.highHandleForm.shadow = 100
      data.highHandleForm.opacity = 100
      data.highHandleForm.position = '中部'
      data.highHandleForm.filePath = ''
      data.dowDisabled = true
      console.log('asas')
    }
    // 获取目录列表
    const getAblbumTable = async () => {
      const { data: res } = await getCatalogues()
      if (res.code === 200) {
        data.AblbumTables = res.data
      }
    }
    // 获取子列表（图片信息）
    const expandDetails = async (expanded, record) => {
      data.catalogueId = record.catalogueId
      if (expanded) {
        const { data: res } = await getPicTable(record.catalogueId)
        if (res.code === 200) {
          data.innerData = res.data
          console.log(data.innerData.length)
          for (let index = 0; index < data.innerData.length; index++) {
            data.innerData[index].size = (data.innerData[index].size / 1048576).toFixed(3)
          }
        }
      }
    }
    // 展开子表格触发
    const expandedRowsChange = (expandedRowKeys) => {
      // data.expandedRowKeys = expandedRowKeys
      const arrTemp = ['']
      data.expandedRowKeys = arrTemp.concat(expandedRowKeys[expandedRowKeys.length - 1])
    }
    // 删除目录
    const deleteAblbum = async (catalogueId) => {
      const { data: res } = await deleteCatalogue(catalogueId)
      if (res.code) {
        message.success('删除成功')
        getAblbumTable()
      } else {
        message.error('删除失败')
      }
    }
    // 删除图片
    const deletePic = async (picInfo) => {
      const { data: res } = await deletePicture(picInfo.filePath, picInfo.fileId)
      if (res.code === 200) {
        getAblbumTable()
        const { data: res } = await getPicTable(data.catalogueId)
        if (res.code === 200) {
          data.innerData = res.data
          message.success('删除成功')
        }
      } else {
        message.error('删除失败')
      }
    }
    // 改变表单显示
    const updataModelVisible = () => {
      data.formModelVisible = !data.formModelVisible
    }
    // 创建相册
    const createAlbum = async () => {
      const { data: res } = await addAlbum(data.albumName)
      if (res.code === 200) {
        message.success('创建成功')
        getAblbumTable()
        updataModelVisible()
        data.albumName = ''
      } else {
        message.error(res.msg)
      }
    }
    // 图片进度
    const handleChange = async (info) => {
      data.progressModelVisible = true
      data.uploadPercent = Number(info.file.percent.toFixed(1))
      if (info.file.percent === 100) {
        getAblbumTable()
        data.countBug = data.countBug + 1
        if (data.countBug === 2) {
          data.countBug = 0
          data.progressModelVisible = false
          message.success('上传成功')
          const { data: res } = await getPicTable(data.catalogueId)
          if (res.code === 200) {
            data.innerData = res.data
            for (let index = 0; index < data.innerData.length; index++) {
              data.innerData[index].size = (data.innerData[index].size / 1048576).toFixed(3)
            }
          }
          getAblbumTable()
        }
      }
    }
    // 修改目标目录
    const updateUploadCatalogue = (catalogueId) => {
      data.catalogueId = catalogueId
    }
    // 图片上传之前
    const beforeUpload = async (file) => {
      const { data: res } = await getSignature(data.catalogueId)
      if (res.code === 200) {
        data.host = res.data.host
        data.signaturesignatureFormData.key = res.data.dir
        data.signaturesignatureFormData.policy = res.data.policy
        data.signaturesignatureFormData.OSSAccessKeyId = res.data.accessKeyId
        data.signaturesignatureFormData.success_action_status = '200'
        data.signaturesignatureFormData.callback = res.data.callback
        data.signaturesignatureFormData.signature = res.data.signature
      }
    }
    // 修改相册名称
    const changeAlbumName = async () => {
      if (data.newAlbumName === '') {
        message.error('不能为空')
        return
      }
      if (data.newAlbumName.length > 7) {
        message.error('名称过长')
        return
      }
      const { data: res } = await updateAlbumName(data.newAlbumName, data.nowUpdateAlbumNameCatalogueId)
      if (res.code === 200) {
        getAblbumTable()
        data.albumNameModelVisible = false
        message.success('修改成功')
      } else {
        data.albumNameModelVisible = false
        message.error('修改失败')
      }
    }
    // 打开修改相册名称表单
    const openUpdateAlbumNameModel = (nowUpdateAlbumNameCatalogueId) => {
      data.nowUpdateAlbumNameCatalogueId = nowUpdateAlbumNameCatalogueId
      data.albumNameModelVisible = true
    }
    // 下载
    const download = async (fileId) => {
      const { data: res } = await downloadFile(fileId)
      if (res.code === 200) {
        message.success('下载成功')
      } else {
        message.error('下载失败')
      }
    }
    // 打开图片处理Model
    const openEditPicModel = (fileUrl) => {
      console.log('处理')
      data.picOption.img = fileUrl
      data.editPicModelVisible = !data.editPicModelVisible
    }
    //  提交图片处理后的结果
    const submitEditPicForm = () => {
      // console.log(cropper.value)
    }
    // 批量删除图片
    const onSelectChange = changableRowKeys => {
      data.selectedRowKeys = changableRowKeys
    }
    const rowSelection = computed(() => {
      return {
        selectedRowKeys: unref(data.selectedRowKeys),
        onChange: onSelectChange,
        hideDefaultSelections: true,
        selections: [{
          key: 's',
          text: '删除',
          onSelect: async () => {
            console.log('删除')
            const { data: res } = await deletePictures(data.selectedRowKeys)
            if (res.code === 200) {
              const { data: res1 } = await getPicTable(data.catalogueId)
              if (res1.code === 200) {
                data.innerData = res1.data
                for (let index = 0; index < data.innerData.length; index++) {
                  data.innerData[index].size = (data.innerData[index].size / 1048576).toFixed(3)
                }
                getAblbumTable()
                message.success('删除成功')
              }
              message.success('删除成功')
              data.selectedRowKeys = []
            } else {
              message.error('删除失败')
            }
          }
        }]
      }
    })

    // 打开高级图像处理
    const openHighHandleModel = (filePath, fileUrl) => {
      data.fileUrl = fileUrl
      data.highHandleForm.filePath = filePath
      data.highHandleModelVisible = true
    }

    // 图像处理
    // const changeImg = () => {
    //   data.picOption.img = data.lists[~~(Math.random() * data.lists.length)].img
    // }
    const startCrop = () => {
      // start
      data.crap = true
      cropper.value.startCrop()
    }
    const stopCrop = () => {
      //  stop
      data.crap = false
      cropper.value.stopCrop()
    }
    const clearCrop = () => {
      // clear
      cropper.value.clearCrop()
    }
    const refreshCrop = () => {
      // clear
      cropper.value.refresh()
    }
    const changeScale = (num) => {
      num = num || 1
      cropper.value.changeScale(num)
    }
    const rotateLeft = () => {
      cropper.value.rotateLeft()
    }
    const rotateRight = () => {
      cropper.value.rotateRight()
    }
    // 预览图片
    const finish = (type) => {
      // 输出
      // var test = window.open('about:blank')
      // test.document.body.innerHTML = '图片生成中..'
      data.previewModelVisible = true
      if (type === 'blob') {
        cropper.value.getCropBlob((temp) => {
          const img = window.URL.createObjectURL(temp)
          data.model = true
          data.modelSrc = img
        })
      } else {
        cropper.value.getCropData((temp) => {
          data.model = true
          data.modelSrc = temp
        })
      }
    }
    // 实时预览函数
    const realTime = (temp) => {
      data.previews = temp
    }

    const finish2 = (type) => {
      this.$refs.cropper2.getCropData((temp) => {
        data.model = true
        data.modelSrc = temp
      })
    }
    const finish3 = (type) => {
      this.$refs.cropper3.getCropData((temp) => {
        data.model = true
        data.modelSrc = temp
      })
    }
    const down = (type) => {
      // event.preventDefault()
      const aLink = document.createElement('a')
      aLink.download = 'demo'
      // 输出
      if (type === 'blob') {
        cropper.value.getCropBlob((temp) => {
          data.downImg = window.URL.createObjectURL(temp)
          console.log(data.downImg)
          aLink.href = window.URL.createObjectURL(temp)
          aLink.click()
        })
      } else {
        cropper.value.getCropData((temp) => {
          // 错误
          data.downImg = temp
          aLink.href = temp
          aLink.click()
        })
      }
      message.success('下载成功')
    }
    const uploadImg = (e, num) => {
      // 上传图片
      // this.option.img
      const file = e.target.files[0]
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
        return false
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        let imgData
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          imgData = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          imgData = e.target.result
        }
        if (num === 1) {
          data.picOption.img = imgData
        } else if (num === 2) {
          this.example2.img = imgData
        }
      }
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file)
    }
    const imgLoad = (msg) => {
      console.log(msg)
    }
    const cropMoving = (temp) => {
      // console.log(temp, '截图框当前坐标')
    }
    // 图像处理
    return {
      data,
      columns,
      innerColumns,
      getAblbumTable,
      expandDetails,
      expandedRowsChange,
      deleteAblbum,
      deletePic,
      updataModelVisible,
      createAlbum,
      handleChange,
      headers: {
        authorization: 'authorization-text'
      },
      updateUploadCatalogue,
      beforeUpload,
      changeAlbumName,
      openUpdateAlbumNameModel,
      download,
      openEditPicModel,
      submitEditPicForm,
      openHighHandleModel,
      // 图像处理
      startCrop,
      stopCrop,
      clearCrop,
      refreshCrop,
      changeScale,
      rotateLeft,
      rotateRight,
      finish,
      realTime,
      finish2,
      finish3,
      down,
      uploadImg,
      imgLoad,
      cropMoving,
      // 图像处理
      cropper,
      rowSelection,
      submitHighHandleForm,
      typeChange,
      store,
      cancelHighHandle
    }
  }
})
</script>
<style lang="scss" scoped>
// :global(.ant-table-thead > tr > th) {

//   text-align: center !important;

// }
// 图像处理

.model img {
  display: block;
  margin: auto;
  max-width: 80%;
  user-select: none;
  background-position: 0px 0px, 10px 10px;
  background-size: 20px 20px;
  background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%), linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
}

// .model-show {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 100vw;
//   height: 100vh;
// }

.cut {
  width: 100%;
  height: 500px;
  margin: 30px auto;
  display: flex;
  justify-content: space-around;

  .test {
    height: 500px;
    width: 500px;
  }
}

.c-item {
  max-width: 800px;
  margin: 10px auto;
  margin-top: 20px;

  span {
    padding-left: 14px;
  }
}

.content {
  margin: auto;
  max-width: 1200px;
  margin-bottom: 100px;
}

.des {
  line-height: 30px;
}

code.language-html {
  padding: 10px 20px;
  margin: 10px 0px;
  display: block;
  background-color: #333;
  color: #fff;
  overflow-x: auto;
  font-family: Consolas, Monaco, Droid, Sans, Mono, Source, Code, Pro, Menlo, Lucida, Sans, Type, Writer, Ubuntu, Mono;
  border-radius: 5px;
  white-space: pre;
}

/*.title, .title:hover, .title-focus, .title:visited {
        color: black;
      }*/

.c-item {
  display: block;
  user-select: none;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 2px;
}

@keyframes slide {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: -100% 0;
  }
}

// 复选框
@supports(-webkit-appearance: none) or (-moz-appearance: none) {

  input[type='checkbox'],
  input[type='radio'] {
    --active: #275EFE;
    --active-inner: #fff;
    --focus: 2px rgba(39, 94, 254, .3);
    --border: #BBC1E1;
    --border-hover: #275EFE;
    --background: #fff;
    --disabled: #F6F8FF;
    --disabled-inner: #E1E6F9;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    height: 21px;
    outline: none;
    display: inline-block;
    vertical-align: top;
    position: relative;
    margin: 0;
    cursor: pointer;
    border: 1px solid var(--bc, var(--border));
    background: var(--b, var(--background));
    transition: background .3s, border-color .3s, box-shadow .2s;

    &:after {
      content: '';
      display: block;
      left: 0;
      top: 0;
      position: absolute;
      transition: transform var(--d-t, .3s) var(--d-t-e, ease), opacity var(--d-o, .2s);
    }

    &:checked {
      --b: var(--active);
      --bc: var(--active);
      --d-o: .3s;
      --d-t: .6s;
      --d-t-e: cubic-bezier(.2, .85, .32, 1.2);
    }

    &:disabled {
      --b: var(--disabled);
      cursor: not-allowed;
      opacity: .9;

      &:checked {
        --b: var(--disabled-inner);
        --bc: var(--border);
      }

      &+label {
        cursor: not-allowed;
      }
    }

    &:hover {
      &:not(:checked) {
        &:not(:disabled) {
          --bc: var(--border-hover);
        }
      }
    }

    &:focus {
      box-shadow: 0 0 0 var(--focus);
    }

    &:not(.switch) {
      width: 21px;

      &:after {
        opacity: var(--o, 0);
      }

      &:checked {
        --o: 1;
      }
    }

    &+label {
      font-size: 14px;
      line-height: 21px;
      display: inline-block;
      vertical-align: top;
      cursor: pointer;
      margin-left: 4px;
    }
  }

  input[type='checkbox'] {
    &:not(.switch) {
      border-radius: 7px;

      &:after {
        width: 5px;
        height: 9px;
        border: 2px solid var(--active-inner);
        border-top: 0;
        border-left: 0;
        left: 7px;
        top: 4px;
        transform: rotate(var(--r, 20deg));
      }

      &:checked {
        --r: 43deg;
      }
    }

    &.switch {
      width: 38px;
      border-radius: 11px;

      &:after {
        left: 2px;
        top: 2px;
        border-radius: 50%;
        width: 15px;
        height: 15px;
        background: var(--ab, var(--border));
        transform: translateX(var(--x, 0));
      }

      &:checked {
        --ab: var(--active-inner);
        --x: 17px;
      }

      &:disabled {
        &:not(:checked) {
          &:after {
            opacity: .6;
          }
        }
      }
    }
  }

  input[type='radio'] {
    border-radius: 50%;

    &:after {
      width: 19px;
      height: 19px;
      border-radius: 50%;
      background: var(--active-inner);
      opacity: 0;
      transform: scale(var(--s, .7));
    }

    &:checked {
      --s: .5;
    }
  }
}

* {
  box-sizing: inherit;

  &:before,
  &:after {
    box-sizing: inherit;
  }
}

//
.list-button div:hover {
  transform: scale(1.1);
}

//
.list-button div {
  font-weight: 600;
  transition: .3s;
  color: #6b6969;
  cursor: pointer;
}
</style>
