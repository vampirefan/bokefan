<template>
 <div class="app-container">
      <el-row>
        <el-col :span="6">
          <el-select clearable v-model="searchType" @change="doSearchMeters" placeholder="选择搜索字段" style="width:100%">
            <el-option v-for="item in searchTypeOptions" :key="item.name" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-input v-model="searchValue" @change="doSearchMeters" placeholder="输入搜索内容" style="width:100%"></el-input>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-button icon="el-icon-plus" @click="openMeterEditDialog()" style="float:right">添加仪器仪表</el-button>
        </el-col>
      </el-row>
      <hr style="height:1px;border:none;border-top:1px dashed #ccc;margin-top:10px" />
      <input type='file' accept='.json' style='display: none' ref="uploadMeterInput" @change="doParseUploadMeterFile($event)">
      <el-button size="small" icon="el-icon-upload2" @click='doUploadMeter' style="float:left; margin-top:2px">导入JSON</el-button>
      <el-button size="small" icon="el-icon-download" style="float:right; margin-top:2px" :loading="loading" @click="doExportCSV">导出CSV</el-button>
      <el-pagination :page-sizes="[10, 50, 100, 999]" :page-size="metersPageSize" layout="total, sizes, prev, pager, next" :total="meter.searchCount" @size-change="metersPageSizeChange" @current-change="metersCurrentPageChange" style="float:right">
      </el-pagination>
      <el-table :data="meter.records" stripe border type="expand" v-loading.body="loading" @row-dblclick="openMeterNoteDialog" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <ul>
              <li>
                购置日期: {{scope.row.getDate | toDate}}
              </li>
              <li>
                使用年限: {{scope.row.serveYear | toDate}}
              </li>
              <li>
                所属工程: {{scope.row.getFromProject}}
              </li>
              <li v-for="item in scope.row.notes" :key="item.date">
                {{item.date | toDate}}: {{item.value}}
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column type="index" width="80">
        </el-table-column>
        <el-table-column prop="category" label="类别">
        </el-table-column>
        <el-table-column prop="name" label="分类名称">
        </el-table-column>
        <el-table-column prop="fullname" label="厂家命名">
        </el-table-column>
        <el-table-column prop="model" label="型号">
        </el-table-column>
        <el-table-column prop="num" label="数量">
        </el-table-column>
        <el-table-column prop="factory" label="生产厂家">
        </el-table-column>
        <el-table-column prop="sn" label="出厂编号">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" type="primary" @click="openMeterEditDialog(scope.row)" icon="el-icon-edit"></el-button>
              <el-button size="mini" type="danger" @click="doDeleteMeter(scope.row)" icon="el-icon-delete"></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    <el-dialog title="更新仪器仪表" :visible.sync="meterEditDialog">
      <el-form :model="meterEdit" label-width="140px" style="width:92%">
        <el-form-item label="仪器仪表分类">
          <el-select clearable v-model="meterEdit.category" placeholder="选择仪器仪表分类" style="width:100%">
            <el-option v-for="item in category" :key="item.name" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仪表名称">
          <el-input v-model="meterEdit.name" auto-complete="off" placeholder="仪表名称(分类)"></el-input>
        </el-form-item>
        <el-form-item label="仪表厂家命名名称">
          <el-input v-model="meterEdit.fullname" auto-complete="off" placeholder="仪表厂家命名名称"></el-input>
        </el-form-item>
        <el-form-item label="仪表型号">
          <el-col :span="14">
            <el-input v-model="meterEdit.model" auto-complete="off" placeholder="仪器仪表型号"></el-input>
          </el-col>
          <el-col :span="2" :offset="2">
            数量
          </el-col>
          <el-col :span="6">
            <el-input v-model="meterEdit.num"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input v-model="meterEdit.factory" auto-complete="off" placeholder="生产厂家"></el-input>
        </el-form-item>
        <el-form-item label="出厂编号">
          <el-input v-model="meterEdit.sn" auto-complete="off" placeholder="出厂编号"></el-input>
        </el-form-item>
        <el-form-item label="购置日期">
          <el-col :span="14">
            <el-date-picker v-model="meterEdit.getDate" type="date" placeholder="选择日期" style="width:100%">
            </el-date-picker>
          </el-col>
          <el-col :span="2" :offset="2">
            年限
          </el-col>
          <el-col :span="6">
            <el-input v-model="meterEdit.serveYear"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="购置项目">
          <el-input v-model="meterEdit.getFromProject" auto-complete="off" placeholder="购置项目"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="meterEditDialog = false">取消</el-button>
        <el-button type="primary" @click="doSaveMeter">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="meterNoteDialogTitle" :visible.sync="meterNoteDialog">
      <el-table :data="meterEdit.notes" border style="width: 100%">
        <el-table-column label="日期">
          <template slot-scope="scope">
            {{scope.row.date | toDate}}
          </template>
        </el-table-column>
        <el-table-column prop="value" label="处理情况">
        </el-table-column>
        <el-table-column width="60">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-close" @click="doRemoveMeterEditNote(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top:30px">
        <el-col :span="6">
          <el-date-picker v-model="meterEditAddNote.date" type="date" placeholder="选择日期" style="width:100%">
          </el-date-picker>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-input placeholder="请输入处理情况" v-model="meterEditAddNote.value">
          </el-input>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-button icon="el-icon-plus" @click="doAddMeterNote">添加处理情况</el-button>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="meterNoteDialog = false">取消</el-button>
        <el-button type="primary" @click="doSaveMeter">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import metersMixin from './mixins/meters'

export default {
  name: 'meters',
  mixins: [metersMixin],
  data () {
    return {
      user: {
        _id: '0',
        name: 'admin'
      },
      category: [
        {
          name: '传输仪表'
        },
        {
          name: '交换仪表'
        },
        {
          name: '数据仪表'
        },
        {
          name: '线路仪表'
        },
        {
          name: '电源、空调'
        },
        {
          name: '无线'
        },
        {
          name: '其他'
        }
      ],
      searchTypeOptions: [
        {
          name: '分类',
          value: 'category'
        },
        {
          name: '名称（分类）',
          value: 'name'
        },
        {
          name: '厂家命名',
          value: 'fullname'
        },
        {
          name: '生产厂家',
          value: 'factory'
        },
        {
          name: '型号',
          value: 'model'
        },
        {
          name: '出厂编号',
          value: 'sn'
        }
      ],
      searchType: '',
      searchValue: '',
      meterEditDialog: false,
      meterNoteDialogTitle: '',
      meterNoteDialog: false,
      meterEdit: {},
      meterEditAddNote: {
        date: new Date(),
        value: ''
      },
      loading: false,
      metersPageSize: 999,
      metersCurrentPage: 1
    }
  },
  computed: {},
  mounted () {
    this.findMeters({
      query: {},
      skip: 0,
      limit: this.metersPageSize
    })
  },
  methods: {
    initMeterEdit () {
      this.meterEdit = {
        category: '',
        name: '',
        fullname: '',
        model: '',
        num: '1',
        factory: '',
        sn: '',
        getDate: new Date(),
        getFromProject: '',
        serveYear: '1',
        notes: []
      }
    },
    openMeterEditDialog (row) {
      if (row) {
        this.meterEdit = {
          ...row
        }
      } else this.initMeterEdit()
      this.meterEditDialog = true
    },
    openMeterNoteDialog (row) {
      if (row) {
        this.meterEdit = {
          ...row
        }
        this.meterNoteDialogTitle = '仪器仪表处理 - ' + this.meterEdit.fullname
      } else this.initMeterEdit()
      this.meterNoteDialog = true
    },
    doSearchMeters () {
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
            fullname: {
              $regex: pattern
            }
          },
          {
            category: {
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
            sn: {
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
        limit: this.metersPageSize,
        skip: (this.metersCurrentPage - 1) * this.metersPageSize
      }
      this.findMeters(qs).then(() => {
        // this.$notify.success('查询成功')
        this.loading = false
      })
    },
    metersPageSizeChange (val) {
      this.metersPageSize = val
      this.doSearchMeters()
    },
    metersCurrentPageChange (val) {
      this.metersCurrentPage = val
      this.doSearchMeters()
    },
    doAddMeterNote () {
      if (this.meterEditAddNote.value) {
        this.meterEdit.notes.push({
          ...this.meterEditAddNote
        })
        this.meterEditAddNote.value = ''
      } else {
        this.$message('请输入处理情况')
      }
    },
    doRemoveMeterEditNote (row) {
      this.meterEdit.notes = this.meterEdit.notes.filter(item => item !== row)
    },
    doSaveMeter () {
      this.meterEdit.editorId = this.user._id
      this.meterEdit.updatedAt = new Date()
      this.saveMeter(this.meterEdit).then(() => {
        this.initMeterEdit()
        this.doSearchMeters()
        this.$message(this.$store.state.message)
        this.meterEditDialog = false
        this.meterNoteDialog = false
      })
    },
    doDeleteMeter (row) {
      this.$confirm('删除仪表: ' + row.name, '提示', {
        type: 'warning'
      })
        .then(() => {
          this.deleteMeter(row._id).then(() => {
            this.doSearchMeters()
            this.$notify(this.$store.state.message)
          })
        })
        .catch(() => {})
    },
    doUploadMeter () {
      this.$refs.uploadMeterInput.click()
    },
    doParseUploadMeterFile (event) {
      let filename = event.target.files[0]
      var reader = new window.FileReader()
      reader.readAsText(filename)
      reader.onload = () => {
        let meters = JSON.parse(reader.result)
        meters.forEach(meter => {
          // console.log(meter)
          let meterDoc = {
            editorId: this.user._id,
            updatedAt: new Date(),
            category: meter.category,
            name: meter.name,
            fullname: meter.fullname,
            factory: meter.factory,
            model: meter.model,
            sn: meter.sn,
            num: meter.num,
            serveYear: meter.serveYear,
            getDate: new Date(meter.getDate),
            getFromProject: meter.getFromProject,
            notes: meter.notes
          }
          this.saveMeter(meterDoc)
          // .then(() => {
          // this.doSearchMeters()
          // console.log('更新成功：' + name)
          // })
        })
      }
    },
    doExportCSV () {
      this.loading = true
      if (this.meter.searchCount === 0) {
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
      this.findMeters(qs).then(() => {
        let CSV = ''
        // Set Report title in first row or line
        CSV += '设备导出' + '\r\n\n'
        // This condition will generate the Label/Header
        let firstRow = ''
        // This loop will extract the label from 1st index of on array
        let data = this.meter.records
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
    }
  }
}
</script>
<style scoped>
.search-bar {
  position: fixed;
  top: 0;
  left: 180px;
  right: 0;
  padding-bottom: 10px;
  z-index: 999;
}

.content-view {
  padding-top: 120px;
}
</style>
