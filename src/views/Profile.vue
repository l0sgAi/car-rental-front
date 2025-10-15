<template>
    <n-config-provider :theme="darkTheme">
        <div class="profile-container">
            <!-- 返回按钮 -->
            <div class="back-button">
                <n-button text @click="goBack">
                    <template #icon>
                        <n-icon :component="ArrowBackOutline" size="24" />
                    </template>
                    返回首页
                </n-button>
            </div>

            <div class="profile-box">
            <div class="profile-header">
                <n-icon :component="PersonCircleOutline" size="64" color="#18a058" />
                <h1>个人中心</h1>
                <p>完善您的个人信息</p>
            </div>

            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

            <n-form  ref="formRef" :model="formData" :rules="rules" label-placement="left">
                <!-- 基本信息 -->
                <n-divider title-placement="left">基本信息</n-divider>

                <div class="form-row">
                    <n-form-item path="username" label="昵称">
                        <n-input v-model:value="formData.username" placeholder="请输入昵称">
                            <template #prefix>
                                <n-icon :component="PersonOutline" />
                            </template>
                        </n-input>
                    </n-form-item>

                    <n-form-item path="phone" label="手机号码">
                        <n-input v-model:value="formData.phone" placeholder="请输入手机号码">
                            <template #prefix>
                                <n-icon :component="PhonePortraitOutline" />
                            </template>
                        </n-input>
                    </n-form-item>
                </div>

                <n-form-item path="gender" label="性别">
                    <n-radio-group v-model:value="formData.gender">
                        <n-radio :value="1">男</n-radio>
                        <n-radio :value="2">女</n-radio>
                    </n-radio-group>
                </n-form-item>

                <!-- 详细信息 -->
                <n-divider title-placement="left">详细信息</n-divider>

                <div class="form-row">
                    <n-form-item path="realName" label="真实姓名">
                        <n-input v-model:value="formData.realName" placeholder="请输入真实姓名">
                            <template #prefix>
                                <n-icon :component="PersonOutline" />
                            </template>
                        </n-input>
                    </n-form-item>

                    <n-form-item path="idNumber" label="身份证号">
                        <n-input v-model:value="formData.idNumber" placeholder="请输入身份证号" maxlength="18">
                            <template #prefix>
                                <n-icon :component="CardOutline" />
                            </template>
                        </n-input>
                    </n-form-item>
                </div>

                <n-form-item path="licenseNumber" label="驾驶证档案编号">
                    <n-input v-model:value="formData.licenseNumber" placeholder="请输入驾驶证档案编号（12位数字）" maxlength="12">
                        <template #prefix>
                            <n-icon :component="CarSportOutline" />
                        </template>
                    </n-input>
                </n-form-item>

                <div class="form-row">
                    <n-form-item path="birthdate" label="出生日期">
                        <n-date-picker 
                            v-model:value="formData.birthdate" 
                            type="date" 
                            placeholder="请选择出生日期" 
                            style="width: 100%" 
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" />
                    </n-form-item>

                    <n-form-item path="licenseDate" label="初次领证日期">
                        <n-date-picker 
                            v-model:value="formData.licenseDate" 
                            type="date" 
                            placeholder="请选择初次领证日期"
                            style="width: 100%" 
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" />
                    </n-form-item>
                </div>

                <!-- 头像上传 -->
                <n-form-item path="avatarUrl" label="头像">
                    <div class="avatar-upload-container">
                        <div class="avatar-preview">
                            <n-avatar 
                                :size="120" 
                                :src="formData.avatarUrl || ''" 
                                fallback-src="https://img.88icon.com/download/jpg/20200812/a64bba5ec27667c367ddf96201fef181_512_512.jpg"
                                round />
                        </div>
                        <div class="upload-section">
                            <n-upload
                                :custom-request="handleAvatarUpload"
                                :show-file-list="false"
                                accept="image/*"
                                @before-upload="beforeAvatarUpload"
                            >
                                <n-button color="#8b5cf6">
                                    <template #icon>
                                        <n-icon :component="CloudUploadOutline" />
                                    </template>
                                    {{ formData.avatarUrl ? '更换头像' : '上传头像' }}
                                </n-button>
                            </n-upload>
                            <span class="upload-tip">支持 JPG、PNG 格式，文件大小不超过 2MB</span>
                            <n-spin v-if="isUploading" size="small" class="upload-loading" />
                        </div>
                    </div>
                </n-form-item>

                <!-- 按钮组 -->
                <div class="button-group">
                    <n-button 
                        type="primary" 
                        size="large" 
                        @click="updateProfile" 
                        :loading="isSubmitting"
                        style="width: 200px">
                        <template #icon>
                            <n-icon :component="SaveOutline" />
                        </template>
                        保存修改
                    </n-button>

                    <n-button 
                        type="info"
                        size="large" 
                        @click="resetForm"
                        style="width: 200px">
                        <template #icon>
                            <n-icon :component="RefreshOutline" />
                        </template>
                        重置
                    </n-button>
                </div>
            </n-form>
        </div>
    </div>
    </n-config-provider>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage, darkTheme } from 'naive-ui';
import {
    NForm,
    NFormItem,
    NInput,
    NButton,
    NDivider,
    NIcon,
    NRadioGroup,
    NRadio,
    NDatePicker,
    NUpload,
    NAvatar,
    NSpin,
    NConfigProvider
} from 'naive-ui';
import {
    PersonOutline,
    PhonePortraitOutline,
    CardOutline,
    CarSportOutline,
    CloudUploadOutline,
    SaveOutline,
    RefreshOutline,
    ArrowBackOutline,
    PersonCircleOutline
} from '@vicons/ionicons5';

// 引入API模块
import { userApi, systemApi } from '../api';

// 引入独立的CSS文件
import '../assets/css/profile.css';

const router = useRouter();
const message = useMessage();

// 表单数据
const formRef = ref(null);
const formData = reactive({
    username: '',
    phone: '',
    gender: null,
    realName: '',
    idNumber: '',
    licenseNumber: '',
    licenseDate: null,
    birthdate: null,
    avatarUrl: ''
});

// 原始数据备份，用于重置
const originalData = ref({});

// 表单验证规则
const rules = {
    username: {
        required: true,
        message: '请输入昵称',
        trigger: 'blur'
    },
    phone: {
        required: true,
        message: '请输入手机号码',
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
    gender: {
        required: true,
        type: 'number',
        message: '请选择性别',
        trigger: 'change'
    },
    idNumber: {
        required: false,
        trigger: 'blur',
        validator: (rule, value) => {
            if (!value) return true;
            const idNumberRegex = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
            if (idNumberRegex.test(value)) {
                return true;
            } else {
                return new Error('请输入有效的身份证号码');
            }
        }
    },
    licenseNumber: {
        required: false,
        trigger: 'blur',
        validator: (rule, value) => {
            if (!value) return true;
            const licenseRegex = /^\d{12}$/;
            if (licenseRegex.test(value)) {
                return true;
            } else {
                return new Error('请输入有效的驾驶证档案编号（12位数字）');
            }
        }
    }
};

const errorMessage = ref('');
const successMessage = ref('');
const isSubmitting = ref(false);
const isUploading = ref(false);

// 日期格式转换函数
const formatDate = (date) => {
    if (!date) return null;
    
    // 如果是数字（时间戳）
    if (typeof date === 'number') {
        const d = new Date(date);
        return formatDateToString(d);
    }
    
    // 如果是字符串
    if (typeof date === 'string') {
        // 如果已经是 yyyy-MM-dd 格式，直接返回
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return date;
        }
        // 否则转换为 Date 对象再格式化
        const d = new Date(date);
        return formatDateToString(d);
    }
    
    // 如果是 Date 对象
    if (date instanceof Date) {
        return formatDateToString(date);
    }
    
    return null;
};

// 将 Date 对象格式化为 yyyy-MM-dd
const formatDateToString = (date) => {
    if (!date || isNaN(date.getTime())) return null;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

// 获取用户信息
const fetchUserInfo = async () => {
    try {
        const response = await userApi.getUserInfo();
        
        if (response.code === 200 && response.data) {
            const userData = response.data;
            
            console.log('后端返回的用户数据:', userData); // 调试日志
            
            // 更新表单数据
            formData.username = userData.username || '';
            formData.phone = userData.phone || '';
            formData.gender = userData.gender ?? null;
            formData.realName = userData.realName || '';
            formData.idNumber = userData.idNumber || '';
            formData.licenseNumber = userData.licenseNumber || '';
            // 转换日期格式
            formData.licenseDate = formatDate(userData.licenseDate);
            formData.birthdate = formatDate(userData.birthdate);
            formData.avatarUrl = userData.avatarUrl || '';
            
            console.log('转换后的表单数据:', formData); // 调试日志
            
            // 保存原始数据
            originalData.value = JSON.parse(JSON.stringify(formData));
            
            message.success('个人信息加载成功');
        } else {
            message.error(response.message || '获取用户信息失败');
        }
    } catch (error) {
        console.error('获取用户信息失败:', error);
        message.error('获取用户信息失败，请稍后重试');
    }
};

// 更新个人信息
const updateProfile = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    
    try {
        await formRef.value?.validate();
        
        isSubmitting.value = true;
        
        const response = await userApi.updateUserSelf({
            username: formData.username,
            phone: formData.phone,
            gender: formData.gender,
            realName: formData.realName || null,
            idNumber: formData.idNumber || null,
            licenseNumber: formData.licenseNumber || null,
            licenseDate: formData.licenseDate || null,
            birthdate: formData.birthdate || null,
            avatarUrl: formData.avatarUrl || null
        });
        
        if (response.code === 200) {
            successMessage.value = '个人信息更新成功！';
            message.success('个人信息更新成功');
            
            // 更新localStorage中的用户名
            if (formData.username) {
                localStorage.setItem('username', formData.username);
            }
            
            // 更新原始数据
            originalData.value = JSON.parse(JSON.stringify(formData));
            
            // 3秒后清除成功消息
            setTimeout(() => {
                successMessage.value = '';
            }, 3000);
        } else {
            errorMessage.value = response.message || '更新失败';
            message.error(response.message || '更新失败');
        }
    } catch (error) {
        if (error?.message) {
            errorMessage.value = error.message;
        } else {
            errorMessage.value = '请填写所有必填字段并确保输入正确';
        }
        console.error('更新失败:', error);
        message.error('更新失败，请检查输入');
    } finally {
        isSubmitting.value = false;
    }
};

// 上传前校验
const beforeAvatarUpload = (data) => {
    const file = data.file.file;
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
        message.error('只能上传图片文件！');
        return false;
    }
    if (!isLt2M) {
        message.error('图片大小不能超过 2MB！');
        return false;
    }
    return true;
};

// 自定义上传
const handleAvatarUpload = async ({ file, onFinish, onError }) => {
    isUploading.value = true;
    try {
        const response = await systemApi.fileUpload(file.file);
        
        if (response.code === 200 && response.data) {
            formData.avatarUrl = response.data;
            message.success('头像上传成功');
            onFinish();
        } else {
            message.error(response.message || '头像上传失败');
            onError();
        }
    } catch (error) {
        console.error('头像上传失败:', error);
        message.error('头像上传失败，请稍后重试');
        onError();
    } finally {
        isUploading.value = false;
    }
};

// 重置表单
const resetForm = () => {
    Object.assign(formData, originalData.value);
    errorMessage.value = '';
    successMessage.value = '';
    message.info('已重置为原始信息');
};

// 返回首页
const goBack = () => {
    router.push('/index');
};

// 组件挂载时获取用户信息
onMounted(() => {
    fetchUserInfo();
});
</script>

<style scoped>
/* 样式已移至独立的CSS文件: src/assets/css/profile.css */
</style>

