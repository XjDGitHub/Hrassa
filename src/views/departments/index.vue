<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <treeToolsVue :treeNode="company" :isRoot="true"></treeToolsVue>
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <treeToolsVue slot-scope="{ data }" :treeNode="data"></treeToolsVue>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import treeToolsVue from "./components/tree-tools.vue";
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils";
export default {
  data() {
    return {
      departs: [],
      defaultProps: {
        lable: "name",
      },
      company: {},
    };
  },
  components: {
    treeToolsVue,
  },
  created() {
    this.getDepartments();
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments();
      this.company = { name: result.companyName, manager: "负责人" };
      this.departs = tranListToTreeData(result.depts, "");
      console.log(result);
    },
  },
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>