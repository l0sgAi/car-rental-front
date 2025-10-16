<template>
    <n-card title="用户管理" :bordered="false">
        <!-- 搜索和操作栏 -->
        <n-space vertical :size="16">
            <n-space justify="space-between">
                <n-input-group>
                    <n-input
                        v-model:value="searchKeyword"
                        placeholder="搜索用户名、手机号、真实姓名..."
                        clearable
                        style="width: 300px"
                        @keyup.enter="handleSearch"
                    >
                        <template #prefix>
                            <n-icon :component="SearchOutline" />
                        </template>
                    </n-input>
                    <n-button type="primary" @click="handleSearch">
                        搜索
                    </n-button>
                </n-input-group>
                <n-button type="success" @click="handleAdd">
                    <template #icon>
                        <n-icon :component="AddOutline" />
                    </template>
                    新增用户
                </n-button>
            </n-space>

            <!-- 用户列表表格 -->
            <n-data-table
                :columns="columns"
                :data="userList"
                :loading="loading"
                :pagination="pagination"
                :bordered="false"
                :single-line="false"
            />
        </n-space>

        <!-- 新增/编辑用户对话框 -->
        <n-modal
            v-model:show="showModal"
            :mask-closable="false"
            preset="dialog"
            :title="modalTitle"
            style="width: 600px"
        >
            <n-form
                ref="formRef"
                :model="formData"
                :rules="rules"
                label-placement="left"
                label-width="100px"
                style="margin-top: 24px"
            >
                <n-form-item label="用户名" path="username">
                    <n-input v-model:value="formData.username" placeholder="请输入用户名" />
                </n-form-item>

                <n-form-item label="密码" path="password" v-if="!isEdit">
                    <n-input
                        v-model:value="formData.password"
                        type="password"
                        show-password-on="click"
                        placeholder="请输入密码"
                    />
                </n-form-item>

                <n-form-item label="手机号" path="phone">
                    <n-input v-model:value="formData.phone" placeholder="请输入手机号" />
                </n-form-item>

                <n-form-item label="真实姓名" path="realName">
                    <n-input v-model:value="formData.realName" placeholder="请输入真实姓名" />
                </n-form-item>

                <n-form-item label="性别" path="gender">
                    <n-radio-group v-model:value="formData.gender">
                        <n-radio :value="0">未知</n-radio>
                        <n-radio :value="1">男</n-radio>
                        <n-radio :value="2">女</n-radio>
                    </n-radio-group>
                </n-form-item>

                <n-form-item label="身份证号" path="idNumber">
                    <n-input v-model:value="formData.idNumber" placeholder="请输入身份证号" maxlength="18" />
                </n-form-item>

                <n-form-item label="驾驶证编号" path="licenseNumber">
                    <n-input v-model:value="formData.licenseNumber" placeholder="请输入驾驶证编号" maxlength="12" />
                </n-form-item>

                <n-form-item label="出生日期" path="birthdate">
                    <n-date-picker 
                        v-model:value="formData.birthdate" 
                        type="date" 
                        placeholder="请选择出生日期"
                        style="width: 100%"
                        clearable
                    />
                </n-form-item>

                <n-form-item label="领证日期" path="licenseDate">
                    <n-date-picker 
                        v-model:value="formData.licenseDate" 
                        type="date" 
                        placeholder="请选择领证日期"
                        style="width: 100%"
                        clearable
                    />
                </n-form-item>

                <n-form-item label="角色" path="role">
                    <n-select v-model:value="formData.role" :options="roleOptions" placeholder="请选择角色" />
                </n-form-item>

                <n-form-item label="状态" path="status">
                    <n-switch v-model:value="formData.status" :checked-value="1" :unchecked-value="0">
                        <template #checked>启用</template>
                        <template #unchecked>禁用</template>
                    </n-switch>
                </n-form-item>
            </n-form>

            <template #action>
                <n-space>
                    <n-button @click="showModal = false">取消</n-button>
                    <n-button type="primary" @click="handleSubmit" :loading="submitting">
                        确定
                    </n-button>
                </n-space>
            </template>
        </n-modal>
    </n-card>
</template>

<script setup>
import { ref, reactive, h, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import {
    NCard,
    NSpace,
    NInputGroup,
    NInput,
    NButton,
    NDataTable,
    NIcon,
    NTag,
    NPopconfirm,
    NModal,
    NForm,
    NFormItem,
    NRadioGroup,
    NRadio,
    NSelect,
    NSwitch,
    NDatePicker
} from 'naive-ui';
import {
    SearchOutline,
    AddOutline,
    CreateOutline,
    TrashOutline
} from '@vicons/ionicons5';
import { userApi } from '../../api';

const message = useMessage();

// 搜索关键词
const searchKeyword = ref('');

// 用户列表
const userList = ref([]);

// 加载状态
const loading = ref(false);

// 分页配置
const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    showSizePicker: true,
    pageSizes: [10, 20, 50, 100],
    onChange: (page) => {
        pagination.page = page;
        fetchUserList();
    },
    onUpdatePageSize: (pageSize) => {
        pagination.pageSize = pageSize;
        pagination.page = 1;
        fetchUserList();
    }
});

// 表格列配置
const columns = [
    {
        title: 'ID',
        key: 'id',
        width: 80
    },
    {
        title: '用户名',
        key: 'username',
        width: 120
    },
    {
        title: '真实姓名',
        key: 'realName',
        width: 100
    },
    {
        title: '手机号',
        key: 'phone',
        width: 130
    },
    {
        title: '性别',
        key: 'gender',
        width: 80,
        render: (row) => {
            const genderMap = { 0: '未知', 1: '男', 2: '女' };
            return genderMap[row.gender] || '未知';
        }
    },
    {
        title: '出生日期',
        key: 'birthdate',
        width: 120,
        render: (row) => {
            return row.birthdate ? new Date(row.birthdate).toLocaleDateString('zh-CN') : '-';
        }
    },
    {
        title: '领证日期',
        key: 'licenseDate',
        width: 120,
        render: (row) => {
            return row.licenseDate ? new Date(row.licenseDate).toLocaleDateString('zh-CN') : '-';
        }
    },
    {
        title: '角色',
        key: 'role',
        width: 100,
        render: (row) => {
            return h(
                NTag,
                { type: row.role === 1 ? 'error' : 'info', size: 'small' },
                { default: () => (row.role === 1 ? '管理员' : '普通用户') }
            );
        }
    },
    {
        title: '状态',
        key: 'status',
        width: 100,
        render: (row) => {
            return h(
                NTag,
                { type: row.status === 1 ? 'success' : 'default', size: 'small' },
                { default: () => (row.status === 1 ? '启用' : '禁用') }
            );
        }
    },
    {
        title: '创建时间',
        key: 'createTime',
        width: 180,
        render: (row) => {
            return row.createTime ? new Date(row.createTime).toLocaleString('zh-CN') : '-';
        }
    },
    {
        title: '操作',
        key: 'actions',
        width: 160,
        fixed: 'right',
        render: (row) => {
            return h(
                NSpace,
                {},
                {
                    default: () => [
                        h(
                            NButton,
                            {
                                size: 'small',
                                type: 'primary',
                                onClick: () => handleEdit(row)
                            },
                            {
                                icon: () => h(NIcon, { component: CreateOutline }),
                                default: () => '编辑'
                            }
                        ),
                        h(
                            NPopconfirm,
                            {
                                onPositiveClick: () => handleDelete(row.id)
                            },
                            {
                                trigger: () =>
                                    h(
                                        NButton,
                                        {
                                            size: 'small',
                                            type: 'error'
                                        },
                                        {
                                            icon: () => h(NIcon, { component: TrashOutline }),
                                            default: () => '删除'
                                        }
                                    ),
                                default: () => '确定要删除该用户吗？'
                            }
                        )
                    ]
                }
            );
        }
    }
];

// 对话框显示状态
const showModal = ref(false);
const isEdit = ref(false);
const modalTitle = ref('新增用户');
const submitting = ref(false);

// 表单引用
const formRef = ref(null);

// 表单数据
const formData = reactive({
    id: null,
    username: '',
    password: '',
    phone: '',
    realName: '',
    gender: 0,
    idNumber: '',
    licenseNumber: '',
    birthdate: null,
    licenseDate: null,
    role: 0,
    status: 1
});

// 角色选项
const roleOptions = [
    { label: '普通用户', value: 0 },
    { label: '管理员', value: 1 }
];

// 表单验证规则
const rules = {
    username: {
        required: true,
        message: '请输入用户名',
        trigger: 'blur'
    },
    password: {
        required: true,
        message: '请输入密码',
        trigger: 'blur'
    },
    phone: {
        required: true,
        message: '请输入手机号',
        trigger: 'blur',
        validator: (rule, value) => {
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (phoneRegex.test(value)) {
                return true;
            } else {
                return new Error('请输入有效的手机号码');
            }
        }
    },
    role: {
        required: true,
        type: 'number',
        message: '请选择角色',
        trigger: 'change'
    },
    status: {
        required: true,
        type: 'number',
        message: '请选择状态',
        trigger: 'change'
    }
};

// 获取用户列表
const fetchUserList = async () => {
    loading.value = true;
    try {
        const response = await userApi.getUserList({
            keyWord: searchKeyword.value,
            pageNum: pagination.page,
            pageSize: pagination.pageSize
        });

        if (response.code === 200) {
            userList.value = response.data || [];
            pagination.itemCount = response.total || 0;
        } else {
            message.error(response.message || '获取用户列表失败');
        }
    } catch (error) {
        console.error('获取用户列表失败:', error);
        message.error('获取用户列表失败，请稍后重试');
    } finally {
        loading.value = false;
    }
};

// 搜索
const handleSearch = () => {
    pagination.page = 1;
    fetchUserList();
};

// 新增用户
const handleAdd = () => {
    isEdit.value = false;
    modalTitle.value = '新增用户';
    resetForm();
    showModal.value = true;
};

// 编辑用户
const handleEdit = (row) => {
    isEdit.value = true;
    modalTitle.value = '编辑用户';
    Object.assign(formData, {
        id: row.id,
        username: row.username,
        phone: row.phone,
        realName: row.realName || '',
        gender: row.gender || 0,
        idNumber: row.idNumber || '',
        licenseNumber: row.licenseNumber || '',
        birthdate: row.birthdate ? new Date(row.birthdate).getTime() : null,
        licenseDate: row.licenseDate ? new Date(row.licenseDate).getTime() : null,
        role: row.role,
        status: row.status
    });
    showModal.value = true;
};

// 删除用户
const handleDelete = async (id) => {
    try {
        const response = await userApi.deleteUser(id);

        if (response.code === 200) {
            message.success('删除成功');
            fetchUserList();
        } else {
            message.error(response.message || '删除失败');
        }
    } catch (error) {
        console.error('删除用户失败:', error);
        message.error('删除失败，请稍后重试');
    }
};

// 提交表单
const handleSubmit = async () => {
    try {
        await formRef.value?.validate();

        submitting.value = true;

        const apiCall = isEdit.value ? userApi.updateUser : userApi.addUser;
        const submitData = { ...formData };

        // 如果是编辑模式，不提交密码字段
        if (isEdit.value) {
            delete submitData.password;
        }

        // 处理日期格式转换
        if (submitData.birthdate) {
            submitData.birthdate = new Date(submitData.birthdate);
        }
        if (submitData.licenseDate) {
            submitData.licenseDate = new Date(submitData.licenseDate);
        }

        const response = await apiCall(submitData);

        if (response.code === 200) {
            message.success(isEdit.value ? '更新成功' : '添加成功');
            showModal.value = false;
            fetchUserList();
        } else {
            message.error(response.message || '操作失败');
        }
    } catch (error) {
        if (error?.message) {
            // 表单验证失败
            return;
        }
        console.error('提交失败:', error);
        message.error('操作失败，请稍后重试');
    } finally {
        submitting.value = false;
    }
};

// 重置表单
const resetForm = () => {
    Object.assign(formData, {
        id: null,
        username: '',
        password: '',
        phone: '',
        realName: '',
        gender: 0,
        idNumber: '',
        licenseNumber: '',
        birthdate: null,
        licenseDate: null,
        role: 0,
        status: 1
    });
};

// 组件挂载时获取用户列表
onMounted(() => {
    fetchUserList();
});
</script>

<style scoped>
/* 可以根据需要添加样式 */
</style>

