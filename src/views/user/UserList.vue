<script setup>
import {pageUsers, removeUserById, updateUser} from "@/api/api";
import {ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {Plus} from "@element-plus/icons-vue";
import { SortDown, SortUp, Sort } from '@element-plus/icons-vue'
//这是一个更改
const users = ref([])
const pageNo = ref(1)
const pageSize = ref(10)
const username = ref('')
const password = ref('')
const location = ref('')
const total = ref(0)
const isShow = ref(false)
const selectUser = ref({})
const followersSortOrder = ref(null)
const followingSortOrder = ref(null)
const likesSortOrder = ref(null)
const imageUrl = ref('')

// 发送请求  获取用户数据
const getUsers = () => {
  const query = {
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    username: username.value,
    password: password.value,
    location: location.value,
  }
  pageUsers(query).then(res => {
    console.info(res.data)
    users.value = res.data.records
    total.value = res.data.total
  })
}
// 页码改变
const pageNoChange = (value) => {
  pageNo.value = value
  getUsers()
}
// 页码改变
const handleSizeChange = (value) => {
  pageSize.value = value
  getUsers()
}
const sortByFollowers = () => {
  if (followersSortOrder.value === null) {
    // 初次点击，降序
    followersSortOrder.value = 'descending'
    // 根据粉丝数降序排序
    users.value.sort((a, b) => b.followers - a.followers)
  } else if (followersSortOrder.value === 'descending') {
    // 第二次点击，升序
    followersSortOrder.value = 'ascending'
    users.value.sort((a, b) => a.followers - b.followers)
  } else {
    // 第三次点击，恢复默认（重新请求数据或不排序）
    followersSortOrder.value = null
    getUsers()
  }
}
const sortByFollowing = () => {
  if (followingSortOrder.value === null) {
    followingSortOrder.value = 'descending'
    users.value.sort((a, b) => b.following - a.following)
  } else if (followingSortOrder.value === 'descending') {
    followingSortOrder.value = 'ascending'
    users.value.sort((a, b) => a.following - b.following)
  } else {
    followingSortOrder.value = null
    getUsers() // 恢复默认，重新请求数据
  }
}
const sortByLikes = () => {
  if (likesSortOrder.value === null) {
    likesSortOrder.value = 'descending'
    users.value.sort((a, b) => b.likes - a.likes)
  } else if (likesSortOrder.value === 'descending') {
    likesSortOrder.value = 'ascending'
    users.value.sort((a, b) => a.likes - b.likes)
  } else {
    likesSortOrder.value = null
    getUsers() // 恢复默认，重新请求数据
  }
}
// 删除
const removeUser = (row) => {
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
          userId: row.userId
        }
        // axios是一个异步请求！！！！
        removeUserById(obj).then((res) => {
          if (res.data) {
            ElMessage({
              message: '操作成功',
              type: 'success',
            })
          }
          getUsers()
        })
      })
      .catch(() => {
      })
}
// 打开弹框
const showEditDialog = (row) => {
  // 不能直接赋值地址  要克隆一个新对象去赋值  不然会影响表格的值
  selectUser.value = JSON.parse(JSON.stringify(row))
  imageUrl.value = row.avater
  isShow.value = true
}
// 编辑用户按钮
const saveUser = () => {
  const user = {
    username: selectUser.value.username,
    password: selectUser.value.password,
    location: selectUser.value.location,
    userId: selectUser.value.userId,
    avater: selectUser.value.avater
  }
  updateUser(user).then(res => {
    if (res.data) {
      ElMessage({
        message: '修改成功',
        type: 'success',
      })
      isShow.value = false
      getUsers()
    }
  })
}

const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  selectUser.value.avater = response.data.url
}

getUsers()
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>用户列表</span>
      </div>
    </template>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="username" placeholder="请输入用户名" clearable/>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="password" placeholder="请输入密码" clearable/>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="location" placeholder="请输入地址" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getUsers">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="userId" label="用户ID"/>
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="password" label="密码"/>
      <el-table-column prop="location" label="地址"/>
      <el-table-column prop="phoneNumber" label="电话"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="followers" :header-cell-style="{ cursor: 'pointer' }">
        <template #header>
          <div @click="sortByFollowers">
            粉丝数
            <el-icon v-if="followersSortOrder === 'descending'"><SortDown/></el-icon>
            <el-icon v-if="followersSortOrder === 'ascending'"><SortUp/></el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="following" :header-cell-style="{ cursor: 'pointer' }">
        <template #header>
          <div @click="sortByFollowing">
            关注数
            <el-icon v-if="followingSortOrder === 'descending'"><SortDown/></el-icon>
            <el-icon v-if="followingSortOrder === 'ascending'"><SortUp/></el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="likes" :header-cell-style="{ cursor: 'pointer' }">
        <template #header>
          <div @click="sortByLikes">
            点赞数
            <el-icon v-if="likesSortOrder === 'descending'"><SortDown/></el-icon>
            <el-icon v-if="likesSortOrder === 'ascending'"><SortUp/></el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="avater" label="头像">
        <template #default="scope">
          <img height="100" :src="scope.row.avater"  alt="">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <!--     scope.row表示该行数据     -->
          <el-button type="danger" @click="removeUser(scope.row)">删除</el-button>
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
          <el-form-item label="用户名">
            <el-input v-model="selectUser.username"/>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="selectUser.password"/>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="selectUser.location"/>
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
          <el-button type="primary" @click="saveUser">
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
