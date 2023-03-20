<template>
  <el-row type="flex" justify="space-between" style="width: 100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>
          <span>{{ treeNode.manager }}</span>
        </el-col>
        <el-col>
          <el-dropdown @command="operateDepts"
            ><span> 操作<i class="el-icon-arrow-down" /></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item command="edit" v-if="!isRoot"
                >编辑部门</el-dropdown-item
              >
              <el-dropdown-item command="del" v-if="!isRoot"
                >删除部门</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from "@/api/departments";
export default {
  props: {
    treeNode: {
      type: Object,
      required: true,
    },
    isRoot: { type: Boolean, default: false },
  },
  methods: {
    operateDepts(type) {
      if (type === "add") {
        this.$emit("addDepts", this.treeNode);
      } else if (type === "edit") {
        this.$emit("editDepts", this.treeNode);
      } else {
        // 删除进入then，失败进入catch
        this.$confirm("确定删除该部门么")
          .then(() => {
            return delDepartments(this.treeNode.id);
          })
          .then(() => {
            this.$emit("delDepts");
            this.$message.success("删除部门成功");
          });
      }
    },
  },
};
</script>

<style>
</style>