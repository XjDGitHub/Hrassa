<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      ref="deptFrom"
      :model="fromData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="fromData.name"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="fromData.code"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          style="width: 80%"
          placeholder="请选择"
          v-model="fromData.manager"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="obj in peoples"
            :key="obj.id"
            :label="obj.username"
            :value="obj.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
          v-model="fromData.introduce"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button @click="btnOk" type="primary" size="small">确定</el-button>
        <el-button size="small" @click="btnCel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments,
} from "@/api/departments";
import { getEmployeeSimple } from "@/api/employess";
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    treeNode: {
      type: Object,
      default: null,
    },
  },
  data() {
    const checkNameRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.fromData.id) {
        isRepeat = depts
          .filter(
            (item) =>
              item.id !== this.fromData.id && item.pid === this.treeNode.pid
          )
          .some((item) => item.name === value);
      } else {
        isRepeat = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value);
      }

      isRepeat ? callback(new Error(`${value}部门已存在`)) : callback();
    };
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.fromData.id) {
        // 编辑模式  因为编辑模式下 不能算自己
        isRepeat = depts.some(
          (item) => item.id !== this.fromData.id && item.code === value && value
        );
      } else {
        // 新增模式
        isRepeat = depts.some((item) => item.code === value && value); // 这里加一个 value不为空 因为我们的部门有可能没有code
      }
      isRepeat ? callback(new Error(`${value}已经有人使用`)) : callback();
    };
    return {
      peoples: [],
      fromData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称要求1-50个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkNameRepeat,
          },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkCodeRepeat,
          },
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            trigger: "blur",
            min: 1,
            max: 300,
            message: "部门介绍要求1-50个字符",
          },
        ],
      },
    };
  },
  methods: {
    // 当一个异步调用另一个异步里的数据的时候，值有可能传不过来
    async getDepartDetail(id) {
      this.fromData = await getDepartDetail(id);
    },
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple();
    },
    btnOk() {
      this.$refs.deptFrom.validate(async (isOK) => {
        if (isOK) {
          if (this.fromData.id) {
            await updateDepartments(this.fromData);
          } else {
            await addDepartments({ ...this.fromData, pid: this.treeNode.id });
          }
          // 新增成功后，通知父组件重新拉取数据
          this.$emit("addDepts");
          // sync修饰符 自定义事件简便写法
          this.$emit("update:showDialog", false);
        }
      });
    },
    btnCel() {
      this.fromData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
      this.$emit("update:showDialog", false);
      this.$refs.deptFrom.resetFields();
    },
  },
  // created() {
  //   getDepartDetail();
  // },
  computed: {
    showTitle() {
      return this.fromData.id ? "编辑部门" : "新增子部门";
    },
  },
};
</script>

<style>
</style>