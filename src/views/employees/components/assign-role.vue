<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <el-checkbox :label="item.id" v-for="item in list" :key="item.id">{{
        item.name
      }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from "@/api/setting";
import { getUserDetailById } from "@/api/user";
import { assignRoles } from "@/api/employess";

export default {
  data() {
    return {
      list: [], // 角色列表
      roleIds: [],
    };
  },
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null,
    },
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 });
      console.log(rows);
      this.list = rows;
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id);
      console.log(roleIds);
      this.roleIds = roleIds;
    },
    btnCancel() {
      this.roleIds = [];
      this.$emit("update:showRoleDialog", false);
    },
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds });
      this.$emit("update:showRoleDialog", false);
    },
  },
};
</script>

<style>
</style>