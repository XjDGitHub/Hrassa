<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission('0', 1)"
            >添加权限</el-button
          >
        </template>
      </page-tools>
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column
          align="center"
          label="标识"
          prop="code"
        ></el-table-column>
        <el-table-column
          align="center"
          label="描述"
          prop="description"
        ></el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button
              type="text"
              v-if="row.type === 1"
              @click="addPermission(row.id, 2)"
              >添加</el-button
            >
            <el-button type="text" @click="editPermission(row.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="delPermission(row.pid)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="新增编辑" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="perForm"
        :rules="rules"
        :model="formData"
        label-width="120px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input
            v-model="formData.description"
            style="width: 90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row></el-dialog
    >
  </div>
</template>

<script>
import {
  getPermissionList,
  addPermission,
  updatePermission,
  delPermission,
  getPermissionDetail,
} from "@/api/permissson";
import { tranListToTreeData } from "@/utils";
export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      },
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    async getPermissionList() {
      this.list = tranListToTreeData(await getPermissionList(), "0");
    },
    // 删除
    delPermission(id) {
      this.$confirm("确定删除该权限么")
        .then(() => {
          return delPermission(id);
        })
        .then(() => {
          this.getPermissionList();
        });
    },
    addPermission(pid, type) {
      this.formData.pid = pid;
      this.formData.type = type;
      this.showDialog = true;
      console.log(this.formData);
    },
    async btnOK() {
      await this.$refs.perForm.validate();
      if (this.formData.id) {
        await updatePermission(this.formData);
      } else {
        await addPermission(this.formData);
      }
      this.getPermissionList();
      this.showDialog = false;
    },
    btnCancel() {
      this.formData = {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      };
      this.showDialog = false;
      this.$refs.perForm.resetFields();
    },
    async editPermission(id) {
      this.formData = await getPermissionDetail(id);
      this.showDialog = true;
    },
  },
};
</script>

<style>
</style>