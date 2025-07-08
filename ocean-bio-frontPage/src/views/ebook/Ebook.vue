<template>
  <div class="ebook-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>电子书管理</span>
          <div>
            <el-button type="info" @click="testUpload" style="margin-right: 10px">测试上传</el-button>
            <el-button type="primary" @click="handleAdd">新增电子书</el-button>
          </div>
        </div>
      </template>
      
      <!-- 调试信息 -->
      <div v-if="debugInfo" class="debug-info">
        <pre>{{ debugInfo }}</pre>
      </div>
      
      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="名称">
          <el-input v-model="searchForm.name" placeholder="请输入电子书名称" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类" clearable>
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 电子书列表 -->
      <el-row :gutter="30">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(item, index) in tableData" :key="index">
          <el-card shadow="hover" class="ebook-card">
            <div class="ebook-cover">
              <img :src="getImageUrl(item.cover)" alt="封面" class="cover-image" />
            </div>
            <div class="ebook-info">
              <h3 class="ebook-title">{{ item.name }}</h3>
              <p class="ebook-desc">{{ item.description || '暂无描述' }}</p>
              <div class="ebook-category">
                <el-tag size="small">{{ getCategoryName(item.category1Id || item.category) }}</el-tag>
              </div>
              <div class="ebook-actions">
                <el-button type="primary" size="small" @click="handleViewDocs(item)">查看文档</el-button>
                <el-dropdown>
                  <el-button size="small">
                    更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="handleEdit(item)">编辑</el-dropdown-item>
                      <el-dropdown-item @click="handleDelete(item)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[8, 16, 24, 32]"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 电子书表单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="ebookFormRef"
        :model="ebookForm"
        :rules="ebookRules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="ebookForm.name" placeholder="请输入电子书名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="ebookForm.category" placeholder="请选择分类">
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="封面">
          <el-upload
            class="cover-upload"
            action="/api/file/upload"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            :on-error="handleCoverError"
            :before-upload="beforeCoverUpload"
            :headers="uploadHeaders"
            :with-credentials="true"
          >
            <img v-if="ebookForm.cover" :src="getImageUrl(ebookForm.cover)" class="cover-preview" />
            <el-icon v-else class="upload-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸: 300x400px</div>
          <div v-if="ebookForm.cover" class="current-cover">
            当前封面URL: {{ ebookForm.cover }}
            <br/>
            显示路径: {{ getImageUrl(ebookForm.cover) }}
          </div>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="ebookForm.description" type="textarea" :rows="4" placeholder="请输入电子书描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getCategoryList } from '@/api/category'
import { createEbook, deleteEbook, getEbookList, updateEbook } from '@/api/ebook'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const debugInfo = ref('')

// 测试上传功能
const testUpload = async () => {
  try {
    const formData = new FormData()
    // 创建一个简单的测试文件
    const file = new File(['test'], 'test.png', { type: 'images/png' })
    formData.append('file', file)
    
    debugInfo.value = '正在测试上传...'
    
    const token = localStorage.getItem('token')
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch('/api/file/upload', {
      method: 'POST',
      headers: headers,
      body: formData
    })
    
    const result = await response.json()
    debugInfo.value = JSON.stringify(result, null, 2)
    
    if (result.code === 200) {
      ElMessage.success('测试上传成功，文件名: ' + result.data)
      // 测试访问URL
      const url = '/file/' + result.data
      debugInfo.value += '\n访问URL: ' + url
    } else {
      ElMessage.error('测试上传失败: ' + (result.message || '未知错误'))
    }
  } catch (error) {
    console.error('测试上传失败:', error)
    debugInfo.value = '测试失败: ' + JSON.stringify(error, null, 2)
    ElMessage.error('测试上传失败')
  }
}

// 搜索表单
const searchForm =reactive({
  name:'',
  category:''
})

// 表格数据
const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const categoryOptions = ref<any[]>([])


// 对话框
const dialogVisible = ref(false)
const dialogTitle = computed(()=> ebookForm.id ? '编辑电子书' : '新增电子书')
const ebookFormRef = ref<FormInstance>()
const ebookForm = reactive({
  id:'',
  name:'',
  category:'',
  description:'',
  cover:''
})

// 表单验证规则
const ebookRules = reactive<FormRules>({
  name:[
    {required:true,message:'请输入电子书名称',trigger:'blur'},
    {min :2,max:50,message:'名称长度应在2-50个字符之间',trigger:'blur'}
  ],
  category:
  [{required:true,message:'请选择分类',trigger:'change'}],
  
})

// 获取电子书列表
const fetchEbookList = async () => {
  loading.value = true
  try {
    const params = {
      page:currentPage.value,
      size:pageSize.value,
      ...searchForm
    }
    //如果有搜索名称，则添加到参数中
    if(searchForm.name){
      params.name = searchForm.name
  }
  console.log('请求参数:',params)
  const res = await getEbookList(params)
  console.log('分类列表响应:',res)

  if(res.success) {
    tableData.value = res.data.list || []
    total.value = res.data.total || 0
  }else {
    ElMessage.error(res.message || '获取电子书列表失败')
  }
} catch (error) {
  console.error('获取电子书列表失败:',error)
  ElMessage.error('获取电子书列表失败，请稍后重试')
} finally {
  loading.value = false
}
}

// 获取所有分类（用于下拉选择）
const fetchAllCategories = async () => {
  try {
    const res = await getCategoryList({page:1,size:1000})
    console.log('所以分类响应:',res)

    if (res.success) {
      categoryOptions.value = res.data.list || []
    }
  } catch (error) {
    console.error('获取所有分类失败:',error)
  }
}

// 获取分类名称
const getCategoryName = (categoryId:string) => {
  if (!categoryId) return '未分类'
  const category = categoryOptions.value.find((item:any) => item.id === categoryId)
  return category ? category.name : '未分类'
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchEbookList()
}



// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.category = ''
  currentPage.value = 1
  fetchEbookList()
}

// 分页相关
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchEbookList()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchEbookList()
}

// 新增电子书
const handleAdd = () => {
  dialogVisible.value = true//设置为可见
  resetEbookForm()//重置表单
}

// 编辑电子书
const handleEdit = (row:any) => {
  resetEbookForm()
  console.log('编辑电子书:',row)
  Object.assign(ebookForm,{
    id:row.id,
    name:row.name,
    Category:row.category,
    description:row.description,
    cover:row.cover
  })
  dialogVisible.value = true
}



// 删除电子书
const handleDelete = async (row:any) => {
  ElMessageBox.confirm('确定删除该电子书吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await deleteEbook(row.id)
    if(res.success) {
      ElMessage.success('删除成功')
      fetchEbookList()
    }else {
      ElMessage.error(res.message || '删除失败')
    }
  })
}

// 查看文档
const handleViewDocs = (row: any) => {
  router.push(`/main/doc/${row.id}`)
}

// 封面上传前的校验
const beforeCoverUpload = (file: any) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传封面图片只能是图片格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传封面图片大小不能超过 2MB!')
  }
  return isImage && isLt2M
}

// 封面上传成功回调
const handleCoverSuccess = (res: any) => {
  console.log('上传响应:', res)
  if (res && res.code === 200) {
    // 使用文件名构建URL
    const filename = res.data
    ebookForm.cover = filename
    console.log('设置封面URL:', ebookForm.cover)
    debugInfo.value = '上传成功: ' + JSON.stringify(res, null, 2)
    // 显示一下实际访问的URL
    const displayUrl = getImageUrl(filename)
    debugInfo.value += '\n实际访问URL: ' + displayUrl
    ElMessage.success('封面上传成功')
  } else {
    ElMessage.error((res && res.message) || '封面上传失败')
  }
}

// 封面上传错误回调
const handleCoverError = (error: any) => {
  console.error('封面上传错误:', error)
  debugInfo.value = '上传错误: ' + JSON.stringify(error, null, 2)
  ElMessage.error('封面上传失败，请检查网络连接或重新上传')
}

// 处理图片URL
const getImageUrl = (url:string) => {
  console.log('获取图片URL:',url);
  if(!url) return '/images/cover1.png'

  //如果是完整的图片路径url（以http开头）
  if(url.startsWith('http')){
    return url
  }
  //如果是相对路径，则确保图片路径正确
  if (url.startsWith('/api')){
    //去掉前缀 /api 因为后端静态资源没有/api前缀
    return url.replace('/api','')
  } else if(url.startsWith('/images/')){
    return url
  } else if(url.startsWith('/')){
    return '/file'+url
  }
  //如果是文件名，则拼接完整的路径
  return  '/file/' + url
 
}

// 上传请求头
const uploadHeaders = computed(() => {
  const token = localStorage.getItem('token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
})

// 重置表单
const resetEbookForm = () => {
  ebookForm.id = ''
  ebookForm.name = ''
  ebookForm.category = ''
  ebookForm.description = ''
  ebookForm.cover = ''
  
  if (ebookFormRef.value) {
    ebookFormRef.value.resetFields()
  }
}

// 提交表单
const submitForm = async () => {
  if (!ebookFormRef.value) return
  
  await ebookFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const isEdit = !!ebookForm.id
        
        // 不要自动设置默认封面，保留用户选择的封面
        const submitData = {
          id: ebookForm.id,
          name: ebookForm.name,
          categoryId: ebookForm.category,
          category1Id: ebookForm.category,
          category2Id: ebookForm.category,
          description: ebookForm.description,
          cover: ebookForm.cover // 使用用户上传的封面URL
        }
        
        console.log('提交数据:', submitData)
        
        const res = isEdit 
          ? await updateEbook(submitData)
          : await createEbook(submitData)
        
        if (res.success) {
          ElMessage.success(`${isEdit ? '更新' : '创建'}成功`)
          dialogVisible.value = false
          fetchEbookList()
        } else {
          ElMessage.error(res.message || `${isEdit ? '更新' : '创建'}失败`)
        }
      } catch (error) {
        console.error(`${ebookForm.id ? '更新' : '创建'}电子书失败:`, error)
        ElMessage.error(`${ebookForm.id ? '更新' : '创建'}电子书失败，请稍后重试`)
      }
    }
  })
}

onMounted(() => {
  fetchEbookList()
  fetchAllCategories()
})
</script>

<style scoped lang="scss">
.ebook-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .search-form {
    margin-bottom: 30px;
  }
  
  .pagination-container {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
  }
  
  .ebook-card {
    margin-bottom: 30px;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    .ebook-cover {
      height: 400px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      
      .cover-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .ebook-info {
      padding: 10px;
      
      .ebook-title {
        font-size: 16px;
        margin-bottom: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      
      .ebook-desc {
        font-size: 14px;
        color: #666;
        margin-bottom: 10px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 40px;
      }
      
      .ebook-category {
        margin-bottom: 10px;
      }
      
      .ebook-actions {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  
  .cover-upload {
    width: 250px;
    height: 400px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .cover-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .upload-icon {
      font-size: 28px;
      color: #8c939d;
    }
  }
  
  .upload-tip {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
  }
  
  .debug-info {
    margin: 10px 0;
    padding: 10px;
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: auto;
    max-height: 300px;
    
    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
      font-family: monospace;
      font-size: 12px;
    }
  }
}
</style> 