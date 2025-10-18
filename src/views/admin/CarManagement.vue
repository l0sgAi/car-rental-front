<template>
    <n-card title="车辆管理" :bordered="false">
        <!-- 搜索和操作栏 -->
        <n-space vertical :size="16">
            <n-space justify="space-between">
                <n-space>
                    <n-input-group>
                        <n-input
                            v-model:value="searchParams.keyWord"
                            placeholder="搜索车辆名称、车牌号..."
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
                    <n-select
                        v-model:value="searchParams.status"
                        placeholder="车辆状态"
                        style="width: 150px"
                        clearable
                        @update:value="handleSearch"
                        :options="statusFilterOptions"
                    />
                </n-space>
                <n-space>
                    <n-button type="info" @click="handleUpCars" :loading="upLoading">
                        <template #icon>
                            <n-icon :component="CloudUploadOutline" />
                        </template>
                        一键上架
                    </n-button>
                    <n-button type="success" @click="handleAdd">
                        <template #icon>
                            <n-icon :component="AddOutline" />
                        </template>
                        新增车辆
                    </n-button>
                </n-space>
            </n-space>

            <!-- 车辆列表表格 -->
            <n-data-table
                :columns="columns"
                :data="carList"
                :loading="loading"
                :pagination="paginationReactive"
                :bordered="false"
                :single-line="false"
                remote
            />
        </n-space>

        <!-- 新增/编辑车辆对话框 -->
        <n-modal
            v-model:show="showModal"
            :mask-closable="false"
            preset="dialog"
            :title="modalTitle"
            style="width: 900px; max-height: 80vh"
        >
            <n-scrollbar style="max-height: 60vh; padding-right: 12px">
                <n-form
                    ref="formRef"
                    :model="formData"
                    :rules="formRules"
                    label-placement="left"
                    label-width="120px"
                    style="margin-top: 24px"
                >
                    <n-divider title-placement="left">基本信息</n-divider>
                    
                    <n-form-item label="品牌" path="brandId">
                        <n-select 
                            v-model:value="formData.brandId" 
                            :options="brandOptions" 
                            placeholder="请选择品牌"
                            filterable
                            remote
                            :loading="brandLoading"
                            :clear-filter-after-select="false"
                            @search="handleBrandSearch"
                            @scroll="handleBrandScroll"
                        />
                    </n-form-item>

                    <n-form-item label="车辆名称" path="name">
                        <n-input v-model:value="formData.name" placeholder="请输入车辆名称" />
                    </n-form-item>

                    <n-form-item label="车牌号" path="number">
                        <n-input v-model:value="formData.number" placeholder="请输入车牌号" />
                    </n-form-item>

                    <n-grid cols="2" x-gap="12">
                        <n-gi>
                            <n-form-item label="车型" path="carType">
                                <n-select v-model:value="formData.carType" :options="carTypeOptions" placeholder="请选择车型" />
                            </n-form-item>
                        </n-gi>
                        <n-gi>
                            <n-form-item label="动力类型" path="powerType">
                                <n-select v-model:value="formData.powerType" :options="powerTypeOptions" placeholder="请选择动力类型" />
                            </n-form-item>
                        </n-gi>
                    </n-grid>

                    <n-divider title-placement="left">租赁信息</n-divider>

                    <n-grid cols="2" x-gap="12">
                        <n-gi>
                            <n-form-item label="日租金(元)" path="dailyRent">
                                <n-input-number 
                                    v-model:value="formData.dailyRent" 
                                    placeholder="请输入日租金" 
                                    style="width: 100%" 
                                    :min="0"
                                    :precision="2"
                                >
                                    <template #prefix>¥</template>
                                </n-input-number>
                            </n-form-item>
                        </n-gi>
                        <n-gi>
                            <n-form-item label="最小租赁天数" path="minRentalDays">
                                <n-input-number 
                                    v-model:value="formData.minRentalDays" 
                                    placeholder="请输入最小租赁天数" 
                                    style="width: 100%" 
                                    :min="1"
                                />
                            </n-form-item>
                        </n-gi>
                    </n-grid>

                    <n-form-item label="车辆状态" path="status">
                        <n-radio-group v-model:value="formData.status">
                            <n-radio :value="0">正常可租</n-radio>
                            <n-radio :value="1">不可租</n-radio>
                        </n-radio-group>
                    </n-form-item>

                    <n-divider title-placement="left">车辆参数</n-divider>

                    <n-grid cols="2" x-gap="12">
                        <n-gi>
                            <n-form-item label="座位数">
                                <n-input-number v-model:value="formData.seat" placeholder="请输入座位数" style="width: 100%" :min="1" :max="1000" />
                            </n-form-item>
                        </n-gi>
                        <n-gi>
                            <n-form-item label="车重(kg)">
                                <n-input-number v-model:value="formData.weight" placeholder="请输入车重" style="width: 100%" :min="0" />
                            </n-form-item>
                        </n-gi>
                    </n-grid>

                    <n-form-item label="尺寸(mm)">
                        <n-space :size="8" style="width: 100%">
                            <n-input-number 
                                v-model:value="formData.length" 
                                placeholder="长" 
                                style="flex: 1" 
                                :min="0"
                                @update:value="updateSize"
                            >
                                <template #prefix>长</template>
                            </n-input-number>
                            <span style="line-height: 34px">×</span>
                            <n-input-number 
                                v-model:value="formData.width" 
                                placeholder="宽" 
                                style="flex: 1" 
                                :min="0"
                                @update:value="updateSize"
                            >
                                <template #prefix>宽</template>
                            </n-input-number>
                            <span style="line-height: 34px">×</span>
                            <n-input-number 
                                v-model:value="formData.height" 
                                placeholder="高" 
                                style="flex: 1" 
                                :min="0"
                                @update:value="updateSize"
                            >
                                <template #prefix>高</template>
                            </n-input-number>
                        </n-space>
                    </n-form-item>

                    <n-grid cols="2" x-gap="12">
                        <n-gi>
                            <n-form-item label="储物容积(L)">
                                <n-input-number v-model:value="formData.volume" placeholder="请输入储物容积" style="width: 100%" :min="0" />
                            </n-form-item>
                        </n-gi>
                        <n-gi>
                            <n-form-item label="购买日期">
                                <n-date-picker 
                                    v-model:value="formData.purchaseTime" 
                                    type="date" 
                                    placeholder="请选择购买日期"
                                    style="width: 100%"
                                />
                            </n-form-item>
                        </n-gi>
                    </n-grid>

                    <n-divider title-placement="left">性能参数</n-divider>

                    <n-grid cols="2" x-gap="12">
                        <n-gi>
                            <n-form-item label="马力">
                                <n-input-number 
                                    v-model:value="formData.horsepower" 
                                    placeholder="请输入马力" 
                                    style="width: 100%" 
                                    :min="0"
                                >
                                    <template #suffix>PS</template>
                                </n-input-number>
                            </n-form-item>
                        </n-gi>
                        <n-gi>
                            <n-form-item label="最大扭矩">
                                <n-input-number 
                                    v-model:value="formData.torque" 
                                    placeholder="请输入最大扭矩" 
                                    style="width: 100%" 
                                    :min="0"
                                >
                                    <template #suffix>N·m</template>
                                </n-input-number>
                            </n-form-item>
                        </n-gi>
                    </n-grid>

                    <n-grid cols="2" x-gap="12">
                        <n-gi>
                            <n-form-item label="百公里油耗(L)">
                                <n-input-number 
                                    v-model:value="formData.fuelConsumption" 
                                    placeholder="请输入油耗" 
                                    style="width: 100%" 
                                    :min="0"
                                    :precision="1"
                                >
                                    <template #suffix>L/100km</template>
                                </n-input-number>
                            </n-form-item>
                        </n-gi>
                        <n-gi>
                            <n-form-item label="理论续航(km)">
                                <n-input-number v-model:value="formData.endurance" placeholder="请输入续航" style="width: 100%" :min="0" >
                                    <template #suffix>km</template>
                                </n-input-number>
                            </n-form-item>
                        </n-gi>
                    </n-grid>

                    <n-form-item label="百公里加速(s)">
                        <n-input-number 
                            v-model:value="formData.acceleration" 
                            placeholder="请输入百公里加速时间" 
                            style="width: 100%" 
                            :min="0"
                            :precision="1"
                        >
                            <template #suffix>秒</template>
                        </n-input-number>
                    </n-form-item>

                    <n-divider title-placement="left">其他信息</n-divider>

                    <n-form-item label="车辆描述">
                        <n-input 
                            v-model:value="formData.description" 
                            type="textarea" 
                            placeholder="请输入车辆描述" 
                            :rows="3"
                            maxlength="1536"
                            show-count
                        />
                    </n-form-item>

                    <n-form-item label="车辆图片">
                        <n-upload
                            :action="uploadAction"
                            :headers="uploadHeaders"
                            list-type="image-card"
                            :max="9"
                            v-model:file-list="fileList"
                            @finish="handleUploadFinish"
                            @remove="handleRemove"
                            accept="image/*"
                        >
                            <!-- <n-button class="upload-button" v-if="fileList.length < 9" type="primary" size="small">
                                <template #icon>
                                    <n-icon :component="CloudUploadOutline" />
                                </template>
                                上传图片
                            </n-button> -->
                        </n-upload>
                        <n-text depth="3" style="font-size: 12px; margin-top: 8px; display: block">
                            最多上传9张图片，支持 jpg、png、gif 格式
                        </n-text>
                    </n-form-item>

                    <n-grid cols="2" x-gap="12">
                        <n-gi>
                            <n-form-item label="热度评分">
                                <n-input-number v-model:value="formData.hotScore" placeholder="热度评分" style="width: 100%" :min="0" :max="100" />
                            </n-form-item>
                        </n-gi>
                        <n-gi>
                            <n-form-item label="平均评分">
                                <n-input-number 
                                    v-model:value="formData.avgScore" 
                                    placeholder="平均评分" 
                                    style="width: 100%" 
                                    :min="0" 
                                    :max="10"
                                    :precision="0"
                                >
                                    <template #suffix>分</template>
                                </n-input-number>
                            </n-form-item>
                        </n-gi>
                    </n-grid>
                </n-form>
            </n-scrollbar>

            <template #action>
                <n-space>
                    <n-button @click="showModal = false">取消</n-button>
                    <n-button type="primary" @click="handleSubmit" :loading="submitLoading">
                        确定
                    </n-button>
                </n-space>
            </template>
        </n-modal>
    </n-card>
</template>

<script setup>
import { ref, reactive, h, onMounted, computed } from 'vue';
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
    NSelect,
    NSwitch,
    NInputNumber,
    NImage,
    NDivider,
    NGrid,
    NGi,
    NDatePicker,
    NRadioGroup,
    NRadio,
    NScrollbar,
    NUpload,
    NText
} from 'naive-ui';
import {
    SearchOutline,
    AddOutline,
    CreateOutline,
    TrashOutline,
    CloudUploadOutline
} from '@vicons/ionicons5';
import { carApi, brandApi, systemApi } from '@/api';

const message = useMessage();

// 搜索参数
const searchParams = reactive({
    keyWord: '',
    status: null,
    pageNum: 1,
    pageSize: 10
});

// 文件上传相关
const fileList = ref([]);
const uploadAction = `${import.meta.env.VITE_API_BASE_URL || '/api'}/system/file/fileUpload`;
const uploadHeaders = computed(() => {
    const tokenName = localStorage.getItem('tokenName');
    const tokenValue = localStorage.getItem('tokenValue');
    return tokenName && tokenValue ? { [tokenName]: tokenValue } : {};
});

// 车辆列表
const carList = ref([]);

// 品牌相关状态
const brandOptions = ref([]);
const brandLoading = ref(false);
const brandPageNum = ref(1);
const brandHasMore = ref(true);
const brandKeyWord = ref('');
const brandMap = ref(new Map()); // 用于存储品牌ID到品牌对象的映射，用于表格显示

// 加载状态
const loading = ref(false);
const submitLoading = ref(false);
const upLoading = ref(false);

// 总数据条数
const totalCount = ref(0);

// 分页配置
const paginationReactive = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    showSizePicker: true,
    pageSizes: [10, 20, 50, 100],
    prefix: (info) => `共 ${info.itemCount} 条`,
    onChange: (page) => {
        searchParams.pageNum = page;
        fetchCarList();
    },
    onUpdatePageSize: (pageSize) => {
        searchParams.pageSize = pageSize;
        searchParams.pageNum = 1;
        paginationReactive.page = 1;
        fetchCarList();
    }
});

// 状态筛选选项
const statusFilterOptions = [
    { label: '全部状态', value: null },
    { label: '正常可租', value: 0 },
    { label: '不可租', value: 1 }
];

// 表格列配置
const columns = [
    {
        title: 'ID',
        key: 'id',
        width: 80,
        fixed: 'left'
    },
    {
        title: '图片',
        key: 'images',
        width: 120,
        render: (row) => {
            const imageUrl = row.images ? row.images.split(',')[0] : '';
            return imageUrl ? h(NImage, {
                src: imageUrl,
                width: 80,
                height: 50,
                objectFit: 'cover',
                style: { borderRadius: '4px' }
            }) : h('span', '暂无图片');
        }
    },
    {
        title: '车辆名称',
        key: 'name',
        width: 150,
        ellipsis: {
            tooltip: true
        }
    },
    {
        title: '车牌号',
        key: 'number',
        width: 120
    },
    {
        title: '品牌',
        key: 'brandId',
        width: 100,
        render: (row) => {
            const brand = brandMap.value.get(row.brandId);
            return brand ? brand.name : row.brandId;
        }
    },
    {
        title: '车型',
        key: 'carType',
        width: 100,
        render: (row) => {
            const typeMap = {
                '轿车': 'info',
                'SUV': 'success',
                'MPV': 'warning',
                '跑车': 'error'
            };
            return h(NTag, { type: typeMap[row.carType] || 'default', size: 'small' }, { default: () => row.carType || '-' });
        }
    },
    {
        title: '动力类型',
        key: 'powerType',
        width: 100
    },
    {
        title: '日租金',
        key: 'dailyRent',
        width: 100,
        render: (row) => `¥${row.dailyRent || 0}`
    },
    {
        title: '座位数',
        key: 'seat',
        width: 80,
        render: (row) => row.seat ? `${row.seat}座` : '-'
    },
    {
        title: '油耗',
        key: 'fuelConsumption',
        width: 100,
        render: (row) => {
            if (row.powerType === '纯电') return '纯电';
            return row.fuelConsumption > 0 ? `${row.fuelConsumption}L/100km` : '-';
        }
    },
    {
        title: '状态',
        key: 'status',
        width: 100,
        render: (row) => {
            return h(
                NTag,
                { type: row.status === 0 ? 'success' : 'error', size: 'small' },
                { default: () => (row.status === 0 ? '正常可租' : '不可租') }
            );
        }
    },
    {
        title: '热度评分',
        key: 'hotScore',
        width: 100
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
                                default: () => '确定要删除该车辆吗？'
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
const modalTitle = ref('新增车辆');

// 表单引用
const formRef = ref(null);

// 表单数据
const formData = reactive({
    id: null,
    brandId: null,
    name: '',
    number: '',
    minRentalDays: 1,
    dailyRent: 0,
    carType: '轿车',
    powerType: '纯油',
    purchaseTime: null,
    horsepower: null,
    torque: null,
    fuelConsumption: null,
    endurance: null,
    description: '',
    size: '',
    length: null, // 车长
    width: null,  // 车宽
    height: null, // 车高
    seat: 5,
    weight: null,
    volume: null,
    acceleration: null,
    images: '',
    status: 0,
    hotScore: 0,
    avgScore: 0
});

// 表单验证规则
const formRules = {
    brandId: [
        { required: true, type: 'number', message: '请选择品牌', trigger: 'change' }
    ],
    name: [
        { required: true, message: '请输入车辆名称', trigger: 'blur' },
        { max: 50, message: '车辆名称长度不能超过50个字符', trigger: 'blur' }
    ],
    number: [
        { max: 50, message: '车牌号长度不能超过50个字符', trigger: 'blur' }
    ],
    minRentalDays: [
        { required: true, type: 'number', message: '请输入最小租赁天数', trigger: 'blur' }
    ],
    dailyRent: [
        { required: true, type: 'number', message: '请输入日租金', trigger: 'blur' }
    ],
    status: [
        { required: true, type: 'number', message: '请选择车辆状态', trigger: 'change' }
    ]
};

// 车型选项
const carTypeOptions = [
    { label: '轿车', value: '轿车' },
    { label: 'SUV', value: 'SUV' },
    { label: 'MPV', value: 'MPV' },
    { label: '跑车', value: '跑车' },
    { label: '越野车', value: '越野车' },
    { label: '特种车', value: '特种车' },
    { label: '其它', value: '其它' }
];

// 动力类型选项
const powerTypeOptions = [
    { label: '纯油', value: '纯油' },
    { label: '混动', value: '混动' },
    { label: '插混', value: '插混' },
    { label: '纯电', value: '纯电' }
];

// 更新尺寸字符串（长×宽×高）
const updateSize = () => {
    if (formData.length && formData.width && formData.height) {
        formData.size = `${formData.length}×${formData.width}×${formData.height}`;
    } else {
        formData.size = '';
    }
};

// 解析尺寸字符串为长宽高
const parseSize = (sizeStr) => {
    if (!sizeStr) {
        formData.length = null;
        formData.width = null;
        formData.height = null;
        return;
    }
    
    // 支持多种分隔符：×、x、X、*、-
    const parts = sizeStr.split(/[×xX*\-]/);
    if (parts.length === 3) {
        formData.length = parseInt(parts[0]) || null;
        formData.width = parseInt(parts[1]) || null;
        formData.height = parseInt(parts[2]) || null;
    }
};

// 获取品牌列表（懒加载）
const fetchBrandList = async (reset = false) => {
    // 如果正在加载，或者没有更多数据且不是重置，则返回
    if (brandLoading.value || (!brandHasMore.value && !reset)) {
        return;
    }
    
    brandLoading.value = true;
    try {
        const params = {
            pageNum: reset ? 1 : brandPageNum.value,
            pageSize: 10
        };
        
        // 如果有搜索关键字，添加到参数
        if (brandKeyWord.value) {
            params.keyWord = brandKeyWord.value;
        }
        
        const res = await brandApi.getBrandList(params);
        
        if (res.code === 200 && res.data) {
            const brands = res.data || [];
            
            if (reset) {
                // 重置时清空现有数据
                brandOptions.value = brands.map(brand => ({
                    label: brand.name,
                    value: brand.id
                }));
                brandPageNum.value = 2; // 下次加载第2页
            } else {
                // 追加数据
                const newOptions = brands.map(brand => ({
                    label: brand.name,
                    value: brand.id
                }));
                brandOptions.value = [...brandOptions.value, ...newOptions];
                brandPageNum.value++; // 页码+1
            }
            
            // 更新品牌映射（用于表格显示）
            brands.forEach(brand => {
                brandMap.value.set(brand.id, brand);
            });
            
            // 判断是否还有更多数据（如果返回数据少于10条，说明没有更多了）
            brandHasMore.value = brands.length === 10;
        }
    } catch (error) {
        console.error('获取品牌列表失败:', error);
        message.warning('获取品牌列表失败，请刷新页面重试');
    } finally {
        brandLoading.value = false;
    }
};

// 处理品牌搜索
const handleBrandSearch = (query) => {
    brandKeyWord.value = query;
    brandPageNum.value = 1;
    brandHasMore.value = true;
    fetchBrandList(true);
};

// 处理品牌下拉框滚动（懒加载）
const handleBrandScroll = (e) => {
    const { target } = e;
    // 判断是否滚动到底部（留10px的误差）
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 10) {
        if (brandHasMore.value && !brandLoading.value) {
            fetchBrandList(false);
        }
    }
};

// 获取车辆列表
const fetchCarList = async () => {
    loading.value = true;
    try {
        const params = {
            pageNum: searchParams.pageNum,
            pageSize: searchParams.pageSize
        };
        
        // 只有在有值的情况下才添加参数
        if (searchParams.keyWord) {
            params.keyWord = searchParams.keyWord;
        }
        
        // 添加状态筛选参数（status可以为0，所以需要判断是否为null/undefined）
        if (searchParams.status !== null && searchParams.status !== undefined) {
            params.status = searchParams.status;
        }
        
        const res = await carApi.getCarList(params);
        
        if (res.code === 200) {
            carList.value = res.data || [];
            // API返回的总数字段是count，不是total
            totalCount.value = res.count || 0;
            paginationReactive.itemCount = res.count || 0;
            paginationReactive.page = searchParams.pageNum;
            
            // 加载表格中出现的品牌信息（用于显示品牌名称）
            await loadBrandsForTable();
        } else {
            message.error(res.message || '获取车辆列表失败');
        }
    } catch (error) {
        console.error('获取车辆列表失败:', error);
        message.error('获取车辆列表失败，请检查网络连接');
    } finally {
        loading.value = false;
    }
};

// 加载表格中出现的品牌信息
const loadBrandsForTable = async () => {
    try {
        // 提取所有唯一的品牌ID
        const brandIds = [...new Set(carList.value.map(car => car.brandId).filter(id => id))];
        
        // 过滤出尚未加载的品牌ID
        const unloadedBrandIds = brandIds.filter(id => !brandMap.value.has(id));
        
        if (unloadedBrandIds.length === 0) {
            return;
        }
        
        // 批量获取品牌信息
        // 由于后端是分页接口，我们需要一次性获取足够的数据
        const res = await brandApi.getBrandList({ 
            pageNum: 1, 
            pageSize: Math.max(100, unloadedBrandIds.length) 
        });
        
        if (res.code === 200 && res.data) {
            res.data.forEach(brand => {
                brandMap.value.set(brand.id, brand);
            });
        }
    } catch (error) {
        console.error('加载品牌信息失败:', error);
    }
};

// 搜索
const handleSearch = () => {
    searchParams.pageNum = 1;
    paginationReactive.page = 1;
    fetchCarList();
};

// 新增车辆
const handleAdd = () => {
    modalTitle.value = '新增车辆';
    resetForm();
    // 打开弹窗时重置并加载品牌列表
    brandKeyWord.value = '';
    brandPageNum.value = 1;
    brandHasMore.value = true;
    fetchBrandList(true);
    showModal.value = true;
};

// 编辑车辆
const handleEdit = (row) => {
    modalTitle.value = '编辑车辆';
    // 深拷贝数据到表单
    Object.keys(formData).forEach(key => {
        if (key === 'purchaseTime' && row[key]) {
            // 将日期字符串转换为时间戳
            formData[key] = new Date(row[key]).getTime();
        } else if (key === 'length' || key === 'width' || key === 'height') {
            // 跳过这三个字段，后面通过parseSize解析
            return;
        } else {
            formData[key] = row[key];
        }
    });
    
    // 解析尺寸字符串为长宽高
    parseSize(row.size);
    
    // 处理图片回显
    if (row.images) {
        const imageUrls = row.images.split(',').filter(url => url.trim());
        fileList.value = imageUrls.map((url, index) => ({
            id: `existing-${index}`,
            name: `图片${index + 1}`,
            status: 'finished',
            url: url.trim()
        }));
    } else {
        fileList.value = [];
    }
    
    // 打开弹窗时重置并加载品牌列表
    brandKeyWord.value = '';
    brandPageNum.value = 1;
    brandHasMore.value = true;
    fetchBrandList(true);
    
    showModal.value = true;
};

// 删除车辆
const handleDelete = async (id) => {
    try {
        const res = await carApi.deleteCar(id);
        if (res.code === 200) {
            message.success('删除成功');
            fetchCarList();
        } else {
            message.error(res.message || '删除失败');
        }
    } catch (error) {
        console.error('删除车辆失败:', error);
        message.error('删除失败，请检查网络连接');
    }
};

// 一键上架车辆到ES
const handleUpCars = async () => {
    upLoading.value = true;
    try {
        const res = await carApi.upCars();
        if (res.code === 200) {
            message.success('上架成功，车辆信息已同步至ES');
        } else {
            message.error(res.message || '上架失败');
        }
    } catch (error) {
        console.error('上架车辆失败:', error);
        message.error('上架失败，请检查网络连接');
    } finally {
        upLoading.value = false;
    }
};

// 处理图片上传完成
const handleUploadFinish = ({ file, event }) => {
    try {
        const response = JSON.parse(event.target.response);
        if (response.code === 200) {
            // 更新文件对象的 url
            file.url = response.data;
            message.success('图片上传成功');
        } else {
            message.error(response.message || '图片上传失败');
            // 移除上传失败的文件
            const index = fileList.value.findIndex(item => item.id === file.id);
            if (index > -1) {
                fileList.value.splice(index, 1);
            }
        }
    } catch (error) {
        console.error('处理上传响应失败:', error);
        message.error('图片上传失败');
        const index = fileList.value.findIndex(item => item.id === file.id);
        if (index > -1) {
            fileList.value.splice(index, 1);
        }
    }
};

// 处理图片删除
const handleRemove = ({ file }) => {
    // 返回 true 确认删除，n-upload 组件会自动处理 fileList 的删除
    // 不需要手动 splice，否则会导致删除两次
    return true;
};

// 提交表单
const handleSubmit = () => {
    formRef.value?.validate(async (errors) => {
        if (errors) {
            message.error('请检查表单填写是否正确');
            return;
        }
        
        submitLoading.value = true;
        try {
            // 更新尺寸字符串
            updateSize();
            
            // 准备提交的数据
            const submitData = { ...formData };
            
            // 移除长宽高的单独字段（后端不需要）
            delete submitData.length;
            delete submitData.width;
            delete submitData.height;
            
            // 处理图片列表，转换为逗号分隔的字符串
            const imageUrls = fileList.value
                .filter(file => file.url && file.status === 'finished')
                .map(file => file.url);
            submitData.images = imageUrls.join(',');
            
            // 处理日期格式
            if (submitData.purchaseTime) {
                submitData.purchaseTime = new Date(submitData.purchaseTime);
            }
            
            let res;
            if (formData.id) {
                // 编辑
                res = await carApi.updateCar(submitData);
            } else {
                // 新增 - 移除id字段
                delete submitData.id;
                res = await carApi.addCar(submitData);
            }
            
            if (res.code === 200) {
                message.success(formData.id ? '更新成功' : '添加成功');
                showModal.value = false;
                fetchCarList();
            } else {
                message.error(res.message || '操作失败');
            }
        } catch (error) {
            console.error('提交失败:', error);
            message.error('操作失败，请检查网络连接');
        } finally {
            submitLoading.value = false;
        }
    });
};

// 重置表单
const resetForm = () => {
    Object.assign(formData, {
        id: null,
        brandId: null,
        name: '',
        number: '',
        minRentalDays: 1,
        dailyRent: 0,
        carType: '轿车',
        powerType: '纯油',
        purchaseTime: null,
        horsepower: null,
        torque: null,
        fuelConsumption: null,
        endurance: null,
        description: '',
        size: '',
        length: null,
        width: null,
        height: null,
        seat: 5,
        weight: null,
        volume: null,
        acceleration: null,
        images: '',
        status: 0,
        hotScore: 0,
        avgScore: 0
    });
    // 清空文件列表
    fileList.value = [];
    formRef.value?.restoreValidation();
};

// 组件挂载时获取数据
onMounted(() => {
    // 只加载车辆列表，品牌在打开弹窗时才加载
    fetchCarList();
});
</script>

<style scoped>
:deep(.n-data-table) {
    font-size: 14px;
}

:deep(.n-card__content) {
    padding: 20px;
}

:deep(.n-form-item-label) {
    font-weight: 500;
}
</style>
