<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="goods_addtime" width="140px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditGoodsDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
    <!-- 修改商品对话框 -->
    <el-dialog
      title="修改商品详情"
      :visible.sync="editGoodsDialogVisible"
      width="50%"
      @close="editGoodsDialogClosed"
    >
      <el-form
        :model="editGoodsForm"
        :rules="editGoodsFormRules"
        ref="editGoodsFormRef"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input v-model="editGoodsForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_number">
          <el-input v-model="editGoodsForm.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="goods_weight">
          <el-input v-model="editGoodsForm.goods_weight" type="number" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0,
      editGoodsDialogVisible: false,
      editGoodsForm: [],
      editGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async removeById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败！')
      }
      this.$message.success('删除参数成功！')
      this.getGoodsList()
    },
    goAddPage() {
      this.$router.push('/goods/add')
    },
    async showEditGoodsDialog(id) {
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品失败！')
      }
      this.editGoodsForm = res.data
      this.editGoodsDialogVisible = true
    },
    editGoodsDialogClosed() {
      this.$refs.editGoodsFormRef.resetFields()
    },
    editGoodsInfo() {
      this.$refs.editGoodsFormRef.validate(async valid => {
        console.log(this.editGoodsForm)
        if (!valid) return
        const { data: res } = await this.$http.put('goods/' + this.editGoodsForm.goods_id, this.editGoodsForm)
        if (res.meta.status !== 200) {
          return this.$message.error('修改商品信息失败！')
        }
        this.editGoodsDialogVisible = false
        this.getGoodsList()
        this.$message.success('更新商品信息成功！')
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
