<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6">
        <el-select clearable v-model="searchType" @change="doSearchBoards" placeholder="选择搜索字段" style="width:100%">
          <el-option v-for="item in searchTypeOptions" :key="item.name" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="12" :offset="1">
        <el-input v-model="searchValue" @change="doSearchBoards" placeholder="输入搜索内容" style="width:100%"></el-input>
      </el-col>
      <el-col :span="4" :offset="1">
        <el-button icon="el-icon-plus" @click="openBoardEditDialog()" style="float:right">添加备品备件</el-button>
      </el-col>
    </el-row>
    <hr style="height:1px;border:none;border-top:1px dashed #ccc;margin-top:10px" />
    <input type='file' accept='.json' style='display: none' ref="uploadBoardInput" @change="doParseUploadBoardFile($event)">
    <el-button size="small" icon="el-icon-upload2" @click='doUploadBoard' style="float:left; margin-top:2px">导入JSON</el-button>
    <el-button size="small" icon="el-icon-download" style="float:right; margin-top:2px" :loading="loading" @click="doExportCSV">导出CSV</el-button>
    <el-pagination :page-sizes="[10, 50, 100, 999]" :page-size="boardsPageSize" layout="total, sizes, prev, pager, next" :total="board.searchCount" @size-change="boardsPageSizeChange" @current-change="boardsCurrentPageChange" style="float:right">
    </el-pagination>
    <el-table :data="board.records" stripe border type="expand" v-loading.body="loading" @row-dblclick="openBoardNoteDialog" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <ul>
            <li>
              入库日期: {{scope.row.getDate | toDate}}
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
      <el-table-column prop="name" label="中文名称">
      </el-table-column>
      <el-table-column prop="nickname" label="英文名称">
      </el-table-column>
      <el-table-column prop="model" label="型号">
      </el-table-column>
      <el-table-column prop="num" label="数量" width="80">
      </el-table-column>
      <el-table-column prop="factory" label="备件厂家">
      </el-table-column>
      <el-table-column prop="sn" label="序列号">
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type="primary" @click="openBoardEditDialog(scope.row)" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="danger" @click="doDeleteBoard(scope.row)" icon="el-icon-delete"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="更新备品备件" :visible.sync="boardEditDialog">
      <el-form :model="boardEdit" label-width="140px" style="width:92%">
        <el-form-item label="备品备件分类">
          <el-select clearable v-model="boardEdit.category" placeholder="选择备品备件分类" style="width:100%">
            <el-option v-for="item in category" :key="item.name" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="中文名称">
          <el-input v-model="boardEdit.name" auto-complete="off" placeholder="仪表名称(分类)"></el-input>
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="boardEdit.nickname" auto-complete="off" placeholder="仪表厂家命名名称"></el-input>
        </el-form-item>
        <el-form-item label="备件厂家">
          <el-input v-model="boardEdit.factory" auto-complete="off" placeholder="生产厂家"></el-input>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-col :span="14">
            <el-input v-model="boardEdit.model" auto-complete="off" placeholder="规格型号代码"></el-input>
          </el-col>
          <el-col :span="2" :offset="2">
            数量
          </el-col>
          <el-col :span="6">
            <el-input v-model="boardEdit.num"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="序列号">
          <el-input v-model="boardEdit.sn" auto-complete="off" placeholder="出厂编号"></el-input>
        </el-form-item>
        <el-form-item label="购置日期">
          <el-col :span="9">
            <el-date-picker v-model="boardEdit.getDate" type="date" placeholder="选择日期" style="width:100%">
            </el-date-picker>
          </el-col>
          <el-col :span="4" :offset="2">
            购置项目
          </el-col>
          <el-col :span="9">
            <el-input v-model="boardEdit.getFromProject" auto-complete="off" placeholder="所属工程"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="boardEditDialog = false">取消</el-button>
        <el-button type="primary" @click="doSaveBoard">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="boardNoteDialogTitle" :visible.sync="boardNoteDialog">
      <el-table :data="boardEdit.notes" border style="width: 100%">
        <el-table-column label="日期">
          <template slot-scope="scope">
            {{scope.row.date | toDate}}
          </template>
        </el-table-column>
        <el-table-column prop="value" label="处理情况">
        </el-table-column>
        <el-table-column width="60">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-close" @click="doRemoveBoardEditNote(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top:30px">
        <el-col :span="6">
          <el-date-picker v-model="boardEditAddNote.date" type="date" placeholder="选择日期" style="width:100%">
          </el-date-picker>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-input placeholder="请输入处理情况" v-model="boardEditAddNote.value">
          </el-input>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-button icon="el-icon-plus" @click="doAddBoardNote">添加处理情况</el-button>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="boardNoteDialog = false">取消</el-button>
        <el-button type="primary" @click="doSaveBoard">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'boards',
  data () {
    return {
      user: {
        _id: '0',
        name: 'admin'
      },
      category: [
        {
          name: '传输'
        },
        {
          name: '交换'
        },
        {
          name: '数据网'
        },
        {
          name: '短消息'
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
          name: '中文名称',
          value: 'name'
        },
        {
          name: '英文名称',
          value: 'nickname'
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
          name: '序列号',
          value: 'sn'
        }
      ],
      searchType: '',
      searchValue: '',
      boardEditDialog: false,
      boardNoteDialogTitle: '',
      boardNoteDialog: false,
      boardEdit: {},
      boardEditAddNote: {
        date: new Date(),
        value: ''
      },
      loading: false,
      boardsPageSize: 999,
      boardsCurrentPage: 1
    }
  },
  computed: {
    ...mapState(['board'])
  },
  mounted () {
    this.findBoards({
      query: {},
      skip: 0,
      limit: this.boardsPageSize
    })
  },
  methods: {
    ...mapActions(['countBoards', 'findBoards', 'saveBoard', 'deleteBoard']),
    initBoardEdit () {
      this.boardEdit = {
        category: '',
        name: '',
        nickname: '',
        model: '',
        num: 1,
        factory: '',
        sn: '',
        getDate: new Date(),
        getFromProject: '',
        notes: []
      }
    },
    openBoardEditDialog (row) {
      if (row) {
        this.boardEdit = {
          ...row
        }
      } else this.initBoardEdit()
      this.boardEditDialog = true
    },
    openBoardNoteDialog (row) {
      if (row) {
        this.boardEdit = {
          ...row
        }
        this.boardNoteDialogTitle =
          '备品备件处理 - ' +
          this.boardEdit.name +
          '(' +
          this.boardEdit.nickname +
          ')'
      } else this.initBoardEdit()
      this.boardNoteDialog = true
    },
    doSearchBoards () {
      this.loading = true
      let query = {}
      if (this.searchType) {
        query[this.searchType] = {
          $regex: this.searchValue,
          $options: 'i'
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
            nickname: {
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
        limit: this.boardsPageSize,
        skip: (this.boardsCurrentPage - 1) * this.boardsPageSize
      }
      this.findBoards(qs).then(() => {
        // this.$notify.success('查询成功')
        this.loading = false
      })
    },
    boardsPageSizeChange (val) {
      this.boardsPageSize = val
      this.doSearchBoards()
    },
    boardsCurrentPageChange (val) {
      this.boardsCurrentPage = val
      this.doSearchBoards()
    },
    doAddBoardNote () {
      if (this.boardEditAddNote.value) {
        this.boardEdit.notes.push({
          ...this.boardEditAddNote
        })
        this.boardEditAddNote.value = ''
      } else {
        this.$message('请输入处理情况')
      }
    },
    doRemoveBoardEditNote (row) {
      this.boardEdit.notes = this.boardEdit.notes.filter(item => item !== row)
    },
    doSaveBoard () {
      this.boardEdit.editorId = this.user._id
      this.boardEdit.updatedAt = new Date()
      this.saveBoard(this.boardEdit).then(() => {
        this.initBoardEdit()
        this.doSearchBoards()
        this.$message(this.$store.state.message)
        this.boardEditDialog = false
        this.boardNoteDialog = false
      })
    },
    doDeleteBoard (row) {
      this.$confirm('删除仪表: ' + row.name, '提示', {
        type: 'warning'
      })
        .then(() => {
          this.deleteBoard(row._id).then(() => {
            this.doSearchBoards()
            this.$notify(this.$store.state.message)
          })
        })
        .catch(() => {})
    },
    doUploadBoard () {
      this.$refs.uploadBoardInput.click()
    },
    doParseUploadBoardFile (event) {
      let filename = event.target.files[0]
      var reader = new window.FileReader()
      reader.readAsText(filename)
      reader.onload = () => {
        let boards = JSON.parse(reader.result)
        boards.forEach(board => {
          // console.log(board)
          let boardDoc = {
            editorId: this.user._id,
            updatedAt: new Date(),
            category: board.category,
            name: board.name,
            nickname: board.nickname,
            factory: board.factory,
            model: board.model,
            sn: board.sn,
            num: board.num,
            getDate: new Date(board.getDate),
            getFromProject: board.getFromProject,
            notes: board.notes
          }
          this.saveBoard(boardDoc)
          // .then(() => {
          // this.doSearchBoards()
          // console.log('更新成功：' + name)
          // })
        })
      }
    },
    doExportCSV () {
      this.loading = true
      if (this.board.searchCount === 0) {
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
      this.findBoards(qs).then(() => {
        let CSV = ''
        // Set Report title in first row or line
        CSV += '设备导出' + '\r\n\n'
        // This condition will generate the Label/Header
        let firstRow = ''
        // This loop will extract the label from 1st index of on array
        let data = this.board.records
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
            if (index === 'getDate') {
              row += '"' + moment(data[i][index]).format('YYYY.MM.DD') + '",'
            } else if (index === 'notes') {
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
