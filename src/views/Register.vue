<template>
    <div class="register-container">
        <div class="register-box">
            <div class="register-header">
                <h1>创建账号</h1>
                <p>请填写以下信息完成注册</p>
            </div>

            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

            <n-form ref="formRef" :model="formData" :rules="rules" label-placement="left" @submit.prevent="register">
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

                <div class="form-row">
                    <n-form-item path="password" label="密码">
                        <n-input v-model:value="formData.password" type="password" placeholder="请输入密码"
                            show-password-on="click">
                            <template #prefix>
                                <n-icon :component="LockClosedOutline" />
                            </template>
                        </n-input>
                    </n-form-item>

                    <n-form-item path="confirmPassword" label="确认密码">
                        <n-input v-model:value="formData.confirmPassword" type="password" placeholder="请再次输入密码"
                            show-password-on="click">
                            <template #prefix>
                                <n-icon :component="LockClosedOutline" />
                            </template>
                        </n-input>
                    </n-form-item>
                </div>

                <n-divider title-placement="left">详细信息（选填）</n-divider>

                <div class="form-row">
                    <n-form-item path="realName" label="真实姓名">
                    <n-input v-model:value="formData.realName" placeholder="选填">
                        <template #prefix>
                            <n-icon :component="PersonOutline" />
                        </template>
                    </n-input>
                </n-form-item>
                    <n-form-item path="idNumber" label="身份证号">
                        <n-input v-model:value="formData.idNumber" placeholder="选填" maxlength="18">
                            <template #prefix>
                                <n-icon :component="CardOutline" />
                            </template>
                        </n-input>
                    </n-form-item>

                    <n-form-item path="licenseNumber" label="驾驶证档案编号">
                        <n-input v-model:value="formData.licenseNumber" placeholder="选填（12位数字）" maxlength="12">
                            <template #prefix>
                                <n-icon :component="CarSportOutline" />
                            </template>
                        </n-input>
                    </n-form-item>
                </div>

                <div class="form-row">
                    <n-form-item path="birthdate" label="出生日期">
                        <n-date-picker v-model:value="formData.birthdate" type="date" placeholder="选填" 
                            style="width: 100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
                    </n-form-item>

                    <n-form-item path="licenseDate" label="初次领证日期">
                        <n-date-picker v-model:value="formData.licenseDate" type="date" placeholder="选填"
                            style="width: 100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
                    </n-form-item>
                </div>

                <n-form-item path="captcha" label="验证码">
                    <n-space align="center">
                        <n-input v-model:value="formData.captcha" placeholder="请输入验证码" style="width: 200px">
                            <template #prefix>
                                <n-icon :component="ShieldCheckmarkOutline" />
                            </template>
                        </n-input>
                        <div class="captcha-code" @click="refreshCaptcha" title="点击刷新验证码">
                            {{ randomCaptcha }}
                        </div>
                    </n-space>
                </n-form-item>

                <n-form-item path="agreeTerms">
                    <n-checkbox v-model:checked="formData.agreeTerms">我已阅读并同意<n-button text>用户协议</n-button>和<n-button
                            text>隐私政策</n-button></n-checkbox>
                </n-form-item>

                <n-button type="primary" block @click="register" style="margin-top: 12px">
                    注册
                </n-button>

                <div class="form-footer">
                    <div class="login-link">
                        <router-link to="/login">已有账号？立即登录</router-link>
                    </div>
                </div>
            </n-form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import {
    NForm,
    NFormItem,
    NInput,
    NButton,
    NDivider,
    NSpace,
    NIcon,
    NCheckbox,
    NGrid,
    NGridItem,
    NRadioGroup,
    NRadio,
    NDatePicker
} from 'naive-ui';
import {
    PersonOutline,
    LockClosedOutline,
    ShieldCheckmarkOutline,
    PhonePortraitOutline,
    CardOutline,
    CarSportOutline,
    CalendarOutline
} from '@vicons/ionicons5';

// 引入API模块
import { userApi, systemApi } from '../api';

// 引入独立的CSS文件
import '../assets/css/register.css';

const router = useRouter();
const message = useMessage();

// 表单数据
const formRef = ref({});
const formData = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: null,
    realName: '',
    idNumber: '',
    licenseNumber: '',
    licenseDate: null,
    birthdate: null,
    captcha: '',
    agreeTerms: false
});

// 表单验证规则
const rules = {
    username: {
        required: true,
        message: '请输入昵称',
        trigger: 'blur'
    },
    password: {
        required: true,
        message: '请输入密码',
        trigger: 'blur'
    },
    confirmPassword: {
        required: true,
        message: '请再次输入密码',
        trigger: 'blur',
        validator: (rule, value) => {
            return value === formData.password ? true : new Error('两次输入的密码不一致')
        }
    },
    phone: {
        required: true,
        message: '请输入手机号码',
        trigger: 'blur',
        validator: (rule, value) => {
            // 手机号正则表达式（11位数字）
            const phoneRegex = /^1[3-9]\d{9}$/
            if (phoneRegex.test(value)) {
                return true
            } else {
                return new Error('请输入有效的手机号码')
            }
        }
    },
    gender: {
        required: true,
        type: 'number',
        message: '请选择性别',
        trigger: 'change'
    },
    captcha: {
        required: true,
        message: '请输入验证码',
        trigger: 'blur'
    },
    agreeTerms: {
        required: true,
        type: 'boolean',
        message: '请阅读并同意用户协议',
        trigger: 'change'
    },
    idNumber: {
        required: false,
        trigger: 'blur',
        validator: (rule, value) => {
            if (!value) return true; // 选填字段，如果为空则通过
            // 身份证号验证：18位，最后一位可以是X
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
            if (!value) return true; // 选填字段，如果为空则通过
            // 驾驶证档案编号：12位纯数字
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

// 注册处理
const register = async (e) => {
    e.preventDefault();
    // console.log('开始注册', formData, formRef.value);
    try {
        await formRef.value?.validate();  // 这是核心改动
        console.log('表单验证通过');

        if (formData.captcha.toLowerCase() !== randomCaptcha.value.toLowerCase()) {
            message.error('验证码输入错误');
            refreshCaptcha();
            return;
        }

        const response = await userApi.register({
            username: formData.username,
            password: formData.password,
            phone: formData.phone,
            gender: formData.gender,
            realName: formData.realName || null,
            idNumber: formData.idNumber || null,
            licenseNumber: formData.licenseNumber || null,
            licenseDate: formData.licenseDate || null,
            birthdate: formData.birthdate || null,
            captcha: formData.captcha
        });

        // console.log(response);
        if (response.code !== 200) {
            message.error(response.message);
            refreshCaptcha();
            return;
        }

        // 保存token信息到localStorage
        if (response.data && response.data.tokenName && response.data.tokenValue) {
            localStorage.setItem('tokenName', response.data.tokenName);
            localStorage.setItem('tokenValue', response.data.tokenValue);
            localStorage.setItem('isLoggedIn', 'true');
        }

        message.success('注册成功');
        router.push('/index');
    } catch (error) {
        // 捕获表单校验失败或注册接口异常
        if (error?.message) {
            errorMessage.value = error.message;
        } else {
            errorMessage.value = '请填写所有必填字段并确保输入正确';
        }
        console.error('注册失败:', error);
        refreshCaptcha();
    }
};


// 验证码
const randomCaptcha = ref(Math.random().toString(36).substring(2, 8).toUpperCase());

// 刷新验证码
const refreshCaptcha = async () => {
    // TODO 换成后端校验
    randomCaptcha.value = Math.random().toString(36).substring(2, 8).toUpperCase();
};
</script>

<style scoped>
/* 样式已移至独立的CSS文件: src/assets/css/register.css */
.captcha-code {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 120px;
    height: 34px;
    background-color: #e8f0fe;
    border-radius: 4px;
    font-family: "Cascadia Code";
    font-style: italic;
    font-weight: bold;
    font-size: 18px;
    color: #333;
    user-select: none;
    cursor: pointer;
}
</style>