<template>
 <div class="app-container">
      <el-row>
        <el-col :span="6">
          <el-select clearable v-model="searchType" @change="doSearchDevices" placeholder="选择搜索字段" style="width:100%">
            <el-option v-for="item in searchTypeOptions" :key="item.name" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-input v-model="searchValue" @change="doSearchDevices" placeholder="输入搜索内容" style="width:100%"></el-input>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-button v-if="user.name" icon="el-icon-plus" @click="openDeviceEditDialog()" style="float:right">添加设备</el-button>
        </el-col>
      </el-row>
      <hr style="height:1px;border:none;border-top:1px dashed #ccc;margin-top:10px" />
      <input type='file' accept='.json' style='display: none' ref="uploadDeviceInput" @change="doParseUploadDeviceFile($event)">
      <el-button size="small" icon="el-icon-upload2" @click='doUploadDevice' style="float:left; margin-top:2px">导入JSON</el-button>
      <el-button size="small" icon="el-icon-download" style="float:right; margin-top:2px" :loading="loading" @click="doExportCSV">导出CSV</el-button>
      <el-pagination :page-sizes="[10, 50, 100, 999]" :page-size="devicesPageSize" layout="total, sizes, prev, pager, next" :total="device.searchCount" @size-change="devicesPageSizeChange" @current-change="devicesCurrentPageChange" style="float:right">
      </el-pagination>
      <el-table :data="device.records" stripe border type="expand" v-loading.body="loading" @row-dblclick="openDeviceNoteDialog" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <ul>
              <li>
                更新时间：{{scope.row.updatedAt | toDateTime}}
              </li>
              <li>
                分类：{{scope.row.category}} -> {{scope.row.subCategory}}
              </li>
              <li>
                地点：{{scope.row.location}}
              </li>
              <li v-if="scope.row.picUrl">
                图片：<img :src="scope.row.picUrl" class="pic">
              </li>
              <li v-for="item in scope.row.notes" :key="item.date">
                {{item.date | toDate}} - {{item.value}}
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column type="index" width="80">
        </el-table-column>
        <el-table-column prop="name" label="设备名称">
        </el-table-column>
        <el-table-column prop="factory" label="厂家" width="180">
        </el-table-column>
        <el-table-column prop="model" label="型号" width="250">
        </el-table-column>
        <el-table-column v-if="user.name" label="操作" width="120">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" type="primary" @click="openDeviceEditDialog(scope.row)" icon="el-icon-edit"></el-button>
              <el-button size="mini" type="danger" @click="doDeleteDevice(scope.row)" icon="el-icon-delete"></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    <el-dialog title="更新设备" :visible.sync="deviceEditDialog">
      <el-form :model="deviceEdit" label-width="80px">
        <el-form-item label="设备分类">
          <el-col :span="8">
            <el-select clearable v-model="deviceEdit.category" placeholder="选择设备分类" style="width:100%" @change="getSubCategoryOptions">
              <el-option v-for="item in category" :key="item.name" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="14" :offset="2">
            <el-select v-model="deviceEdit.subCategory" placeholder="组合分类（节）" clearable filterable allow-create remote :remote-method="subCategoryQuery" style="width:100%">
              <el-option v-for="item in subCategoryOptions" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="deviceEdit.name" auto-complete="off" placeholder="设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备厂家">
          <el-input v-model="deviceEdit.factory" auto-complete="off" placeholder="设备厂家"></el-input>
        </el-form-item>
        <el-form-item label="设备型号">
          <el-input v-model="deviceEdit.model" auto-complete="off" placeholder="设备型号"></el-input>
        </el-form-item>
        <el-form-item label="设备地点">
          <el-input v-model="deviceEdit.location" auto-complete="off" placeholder="设备地点"></el-input>
        </el-form-item>
        <el-form-item label="使用日期">
          <el-date-picker v-model="deviceEdit.getDate" type="date" placeholder="选择日期" style="width:100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload class="pic-uploader" action="/uploads" :show-file-list="false" :on-success="handlePicSuccess" :before-upload="beforePicUpload">
            <img v-if="imageUrl" :src="imageUrl" class="pic">
            <i v-else class="el-icon-plus pic-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deviceEditDialog = false">取消</el-button>
        <el-button type="primary" @click="doSaveDevice">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="deviceNoteDialogTitle" :visible.sync="deviceNoteDialog">
      <el-table :data="deviceEdit.notes" border style="width: 100%">
        <el-table-column label="日期">
          <template slot-scope="scope">
            {{scope.row.date | toDate}}
          </template>
        </el-table-column>
        <el-table-column prop="value" label="处理情况">
        </el-table-column>
        <el-table-column width="60">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-close" @click="doRemoveDeviceEditNote(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top:30px">
        <el-col :span="6">
          <el-date-picker v-model="deviceEditAddNote.date" type="date" placeholder="选择日期" style="width:100%">
          </el-date-picker>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-input placeholder="请输入处理情况" v-model="deviceEditAddNote.value">
          </el-input>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-button icon="el-icon-plus" @click="doAddDeviceNote">添加处理情况</el-button>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deviceNoteDialog = false">取消</el-button>
        <el-button type="primary" @click="doSaveDevice">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import devicesMixin from './mixins/devices'

export default {
  name: 'devices',
  mixins: [devicesMixin],
  data () {
    return {
      user: {
        _id: '0',
        name: 'admin'
      },
      category: [
        {
          name: '无线类',
          children: [
            'GSMR_分组无线子系统 | SGSN',
            'GSMR_分组无线子系统 | GGSN',
            'GSMR_分组无线子系统 | 网管服务器',
            'GSMR_分组无线子系统 | 网管终端',
            'GSMR_分组无线子系统 | DNS',
            'GSMR_分组无线子系统 | RADIUS',
            'GSMR_分组无线子系统 | GROS',
            'GSMR_分组无线子系统 | GRIS/M-GRIS',
            'GSMR_交换子系统 | MSC',
            'GSMR_交换子系统 | 网管服务器',
            'GSMR_交换子系统 | HLR',
            'GSMR_交换子系统 | 网管终端',
            'GSMR_交换子系统 | AC',
            'GSMR_智能网子系统 | SCP',
            'GSMR_智能网子系统 | 网管服务器',
            'GSMR_智能网子系统 | 网管终端',
            'GSMR_交换子系统 | SMSC',
            'GSMR_SIM卡管理系统 | 服务器',
            'GSMR_SIM卡管理系统 | 终端',
            'GSMR_SIM卡管理系统 | 读卡机',
            'GSMR_GSMR接口监测系统 | ABIS接口',
            'GSMR_GSMR接口监测系统 | A接口',
            'GSMR_GSMR接口监测系统 | PRI接口',
            'GSMR_GSMR接口监测系统 | 服务器',
            'GSMR_GSMR接口监测系统 | 终端',
            'GSMR_GSMR接口监测系统 | 网关',
            'GSMR_无线子系统 | BSC/PCU',
            'GSMR_无线子系统 | TRAU',
            'GSMR_无线子系统 | BTS',
            'GSMR_无线子系统 | 网管服务器',
            'GSMR_无线子系统 | 网管终端',
            'GSMR_手持台 | 作业手持台（OPH）',
            'GSMR_手持台 | 通用手持台（GPH）'
          ]
        },
        {
          name: '有线类',
          children: [
            '综合布线_综合布线 | 交换机',
            '电源_设备 | UPS（含电池）10KVA以上',
            '其它设备_机房空调设备 | 柜式',
            '电源_配电设备 | 两路电源转换设备',
            '电源_配电设备 | 交流配电盘',
            '电源_配电设备 | 直流配电盘',
            '综合布线_综合布线 | 同轴电缆',
            '综合布线_综合布线 | 超5类线',
            '综合布线_综合布线 | 超6类线'
          ]
        },
        {
          name: '数据通信系统',
          children: [
            '数据通信系统_网络设备 | 路由反射器',
            '数据通信系统_网管 | 服务器',
            '数据通信系统_网管 | 终端',
            '数据通信系统_网络设备 | 防火墙',
            '数据通信系统_网络设备 | 核心层路由器',
            '数据通信系统_网络设备 | 汇聚层路由器',
            '数据通信系统_网络设备 | 接入层路由器'
          ]
        },
        {
          name: '通信线路系统',
          children: ['光电缆线路_光缆 | 地区光缆']
        },
        {
          name: '传输与接入网系统',
          children: [
            '数字传输系统_同步数字体系(SDH) | STM-4终端复用设备',
            '数字传输系统_同步数字体系(SDH) | STM-16终端复用设备',
            '数字传输系统_终端接入 | 协议转换器',
            '传输配套系统_传输配套系统 | DDF',
            '传输配套系统_传输配套系统 | ODF'
          ]
        }
      ],
      searchTypeOptions: [
        {
          name: '分类',
          value: 'category'
        },
        {
          name: '组合分类（节）',
          value: 'subCategory'
        },
        {
          name: '设备名称',
          value: 'name'
        },
        {
          name: '厂家',
          value: 'factory'
        },
        {
          name: '型号',
          value: 'model'
        },
        {
          name: '地点',
          value: 'location'
        }
      ],
      searchType: '',
      searchValue: '',
      deviceEditDialog: false,
      deviceNoteDialogTitle: '',
      deviceNoteDialog: false,
      deviceEdit: {},
      deviceEditAddNote: {
        date: new Date(),
        value: ''
      },
      loading: false,
      subCategoryOptions: [],
      devicesPageSize: 999,
      devicesCurrentPage: 1,
      imageUrl: ''
    }
  },
  mounted () {
    this.findDevices({
      query: {},
      sort: {
        updatedAt: -1
      },
      skip: 0,
      limit: this.devicesPageSize
    })
  },
  methods: {
    initDeviceEdit () {
      this.deviceEdit = {
        category: '',
        subCategory: '',
        name: '',
        factory: '',
        model: '',
        location: '',
        getDate: new Date(),
        notes: [],
        picUrl: ''
      }
      this.imageUrl = ''
    },
    changeSearchType () {},
    openDeviceEditDialog (row) {
      if (row) {
        this.deviceEdit = {
          ...row
        }
        this.imageUrl = row.picUrl
      } else this.initDeviceEdit()
      this.deviceEditDialog = true
    },
    getSubCategoryOptions (query) {
      if (query === '') {
        this.subCategoryOptions = []
      } else {
        this.subCategoryOptions = this.category
          .filter(item => {
            return item.name.indexOf(query) > -1
          })
          .shift().children
      }
    },
    subCategoryQuery (query) {
      if (this.deviceEdit.category === '') {
        this.subCategoryOptions = []
      } else {
        this.subCategoryOptions = this.category
          .filter(item => {
            return item.name.indexOf(this.deviceEdit.category) > -1
          })
          .shift()
          .children.filter(subs => {
            return subs.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
      }
    },
    openDeviceNoteDialog (row) {
      if (row) {
        this.deviceEdit = {
          ...row
        }
        this.deviceNoteDialogTitle = '设备处理 - ' + this.deviceEdit.name
      } else this.initDeviceEdit()
      this.deviceNoteDialog = true
    },
    doSearchDevices () {
      this.loading = true
      let query = {}
      if (this.searchType) {
        query[this.searchType] = {
          $regex: new RegExp(this.searchValue)
        }
      } else if (this.searchValue) {
        let patternStr =
          this.searchValue
            .split(' ')
            .map(item => {
              return '(?=.*' + item + ')'
            })
            .join('') + '.*'
        let pattern = new RegExp(patternStr)
        query['$or'] = [
          {
            name: {
              $regex: pattern
            }
          },
          {
            category: {
              $regex: pattern
            }
          },
          {
            subCategory: {
              $regex: pattern
            }
          },
          {
            factory: {
              $regex: pattern
            }
          },
          {
            model: {
              $regex: pattern
            }
          },
          {
            location: {
              $regex: pattern
            }
          }
        ]
      } else {
        query = {}
      }
      let qs = {
        query: query,
        sort: {
          updatedAt: -1
        },
        limit: this.devicesPageSize,
        skip: (this.devicesCurrentPage - 1) * this.devicesPageSize
      }
      this.findDevices(qs).then(() => {
        // this.$notify.success('查询成功')
        this.loading = false
      })
    },
    devicesPageSizeChange (val) {
      this.devicesPageSize = val
      this.doSearchDevices()
    },
    devicesCurrentPageChange (val) {
      this.devicesCurrentPage = val
      this.doSearchDevices()
    },
    doAddDeviceNote () {
      if (this.deviceEditAddNote.value) {
        this.deviceEdit.notes.push({
          ...this.deviceEditAddNote
        })
        this.deviceEditAddNote.value = ''
      } else {
        this.$message('请输入处理情况')
      }
    },
    doRemoveDeviceEditNote (row) {
      this.deviceEdit.notes = this.deviceEdit.notes.filter(
        item => item !== row
      )
    },
    doSaveDevice () {
      this.deviceEdit.editorId = this.user._id
      this.deviceEdit.updatedAt = new Date()
      this.saveDevice(this.deviceEdit).then(() => {
        this.initDeviceEdit()
        this.doSearchDevices()
        this.$message(this.$store.state.message)
        this.deviceEditDialog = false
        this.deviceNoteDialog = false
      })
    },
    doDeleteDevice (row) {
      this.$confirm('删除设备: ', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.deleteDevice(row._id).then(() => {
            this.doSearchDevices()
            this.$notify(this.$store.state.message)
          })
        })
        .catch(() => {})
    },
    doUploadDevice () {
      this.$refs.uploadDeviceInput.click()
    },
    doParseUploadDeviceFile (event) {
      let filename = event.target.files[0]
      var reader = new window.FileReader()
      reader.readAsText(filename)
      reader.onload = () => {
        let devices = JSON.parse(reader.result)
        devices.forEach(device => {
          // console.log(device)
          let deviceDoc = {
            editorId: this.user._id,
            updatedAt: new Date(),
            category: device.category,
            subCategory: device.subCategory,
            name: device.name,
            factory: device.factory,
            model: device.model,
            location: device.location,
            getDate: new Date(device.getDate),
            notes: device.notes
          }
          this.saveDevice(deviceDoc)
          // .then(() => {
          // this.doSearchDevices()
          // console.log('更新成功：' + name)
          // })
        })
      }
    },
    doExportCSV () {
      this.loading = true
      if (this.device.searchCount === 0) {
        this.$message.error('请先查询，再进行导出！')
        this.loading = false
        return
      }
      let query = {}
      // if (this.searchCategory) query.category = this.searchCategory
      // if (this.searchName) query.name = this.searchName
      query.searchType = this.searchType
      query.searchValue = this.searchValue
      let qs = {
        query: query
      }
      this.findDevices(qs).then(() => {
        let CSV = ''
        // Set Report title in first row or line
        CSV += '设备导出' + '\r\n\n'
        // This condition will generate the Label/Header
        let firstRow = ''
        // This loop will extract the label from 1st index of on array
        let data = this.device.records
        for (var rowIndex in data[0]) {
          // Now convert each value to string and comma-seprated
          firstRow += rowIndex + ','
        }
        firstRow = firstRow.slice(0, -1)
        // append Label firstRow with line break
        CSV += firstRow + '\r\n'
        // 1st loop is to extract each row
        for (var i = 0; i < data.length; i++) {
          let row = ''
          // 2nd loop will extract each column and convert it in string comma-seprated
          for (var index in data[i]) {
            if (index === 'getDate') { row += '"' + moment(data[i][index]).format('YYYY.MM.DD') + '",' } else if (index === 'notes') {
              row +=
                '"' +
                data[i][index]
                  .map(item => {
                    return (
                      moment(item.date).format('YYYY.MM.DD') + ':' + item.value
                    )
                  })
                  .join('; ') +
                '",'
            } else row += '"' + data[i][index] + '",'
          }
          row.slice(0, row.length - 1)
          // add a line break after each row
          CSV += row + '\r\n'
        }
        // Generate a file name
        var fileName = '设备导出'
        // Initialize file format you want csv or xls
        let csvData = new window.Blob(['\uFEFF' + CSV], {
          type: 'text/csv'
        })
        let csvUrl = window.URL.createObjectURL(csvData)
        // var uri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURI(CSV)
        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension
        // this trick will generate a temp <a /> tag
        var link = document.createElement('a')
        link.href = csvUrl
        // set the visibility hidden so it will not effect on your web-layout
        link.style = 'visibility:hidden'
        link.download = fileName + '.csv'
        // this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link)
        this.loading = false
        link.click()
        document.body.removeChild(link)
      })
    },
    handlePicSuccess (res, file) {
      // console.log(file)
      this.imageUrl = URL.createObjectURL(file.raw)
      this.deviceEdit.picUrl = '/dist/uploads/' + file.response.filename
    },
    beforePicUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
<style scoped>
/* .pic-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.pic-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.pic-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 245px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  border-color: #20a0ff;
}

.pic {
  width: 245px;
  height: 178px;
  display: block;
} */

/* .search-bar {
  position: fixed;
  top: 0;
  left: 180px;
  right: 0;
  padding-bottom: 10px;
  z-index: 999;
}

.content-view {
  padding-top: 120px;
} */
</style>
