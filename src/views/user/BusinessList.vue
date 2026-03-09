<script setup>
import {pageBusiness, removeBusiness1, updateBusiness} from "@/api/api";
import {ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {Plus} from "@element-plus/icons-vue";

const business = ref([])
const pageNo = ref(1)
const pageSize = ref(10)
const name = ref('')
const location = ref('')
const businessType = ref('')
const total = ref(0)
const isShow = ref(false)
const selectBusiness = ref({})

// 发送请求，获取商家数据
const getBusiness = () => {
  const query = {
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    name: name.value,
    location: location.value,
    businessType: businessType.value,
  }
  pageBusiness(query).then(res => {
    business.value = res.data.records
    total.value = res.data.total
  })
}
// 页码改变
const pageNoChange = (value) => {
  pageNo.value = value
  getBusiness()
}
// 页码改变
const handleSizeChange = (value) => {
  pageSize.value = value
  getBusiness()
}
// 删除
const removeBusiness= (row) => {
  ElMessageBox.confirm(
      '是否确认删除当前数据?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        // 发送删除请求   调用完成后再调用getUsers方法
        const obj = {
          businessId: row.businessId
        }
        // axios是一个异步请求！！！！
        removeBusiness1(obj).then((res) => {
          if (res.data) {
            ElMessage({
              message: '操作成功',
              type: 'success',
            })
          }
          getBusiness()
        })
      })
      .catch(() => {
      })
}
// 打开弹框
const showEditDialog = (row) => {
  // 不能直接赋值地址  要克隆一个新对象去赋值  不然会影响表格的值
  selectBusiness.value = JSON.parse(JSON.stringify(row))
  imageUrl.value = row.coverImage
  isShow.value = true
}
// 编辑商家按钮
const saveBusiness = () => {
  const business = {
    name: selectBusiness.value.name,
    location: selectBusiness.value.location,
    businessType: selectBusiness.value.businessType,
    businessId: selectBusiness.value.businessId,
    coverImage: selectBusiness.value.coverImage
  }
  updateBusiness(business).then(res => {
    if (res.data) {
      ElMessage({
        message: '修改成功',
        type: 'success',
      })
      isShow.value = false
      getBusiness()
    }
  })
}


const imageUrl = ref('')

const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  selectBusiness.value.coverImage = response.data.url
}
getBusiness()
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>商家列表</span>
      </div>
    </template>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="商家名称">
        <el-input v-model="name" placeholder="请输入商家名称" clearable/>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="location" placeholder="请输入地址" clearable/>
      </el-form-item>
      <el-form-item label="店铺类型">
        <el-input v-model="businessType" placeholder="请输入店铺类型" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getBusiness">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="business" style="width: 100%">
      <el-table-column prop="businessId" label="商家ID" width="80"/>
      <el-table-column prop="name" label="商家名称"/>
      <el-table-column prop="description" label="店铺描述"/>
      <el-table-column prop="location" label="地址"/>
      <el-table-column prop="businessType" label="店铺类型"/>
      <el-table-column prop="coverImage" label="店铺图片">
        <template #default="scope">
          <img height="100" :src="scope.row.coverImage"  alt="">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <!--     scope.row表示该行数据     -->
          <el-button type="danger" @click="removeBusiness(scope.row)">删除</el-button>
          <el-button type="primary" @click="showEditDialog(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :background="true"
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="pageNoChange"
    />
    <!--  编辑弹框  -->
    <el-dialog
        v-model="isShow"
        title="Tips"
        width="500"
        :before-close="handleClose"
    >
      <span>
        <el-form label-width="auto" style="max-width: 600px">
          <el-form-item label="商家名称">
            <el-input v-model="selectBusiness.name"/>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="selectBusiness.location"/>
          </el-form-item>
          <el-form-item label="店铺类型">
            <el-input v-model="selectBusiness.businessType"/>
          </el-form-item>
          <el-form-item label="头像">
            <el-upload
                class="avatar-uploader"
                action="/api/file/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
            >
               <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
               <el-icon v-else class="avatar-uploader-icon"><Plus/></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isShow = false">取消</el-button>
          <el-button type="primary" @click="saveBusiness">
            修改
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>