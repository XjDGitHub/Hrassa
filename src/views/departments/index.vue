<template>
  <div class="dashboard-container" v-loading="loading">
    <div class="app-container">
      <el-card class="tree-card">
        <treeToolsVue
          @addDepts="addDepts"
          :treeNode="company"
          :isRoot="true"
        ></treeToolsVue>
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <treeToolsVue
            @addDepts="addDepts"
            @delDepts="getDepartments"
            @editDepts="editDepts"
            slot-scope="{ data }"
            :treeNode="data"
          ></treeToolsVue>
        </el-tree>
      </el-card>
    </div>
    <addDeptVue
      @addDepts="getDepartments"
      ref="addDept"
      :showDialog.sync="showDialog"
      :treeNode="node"
    ></addDeptVue>
  </div>
</template>

<script>
import treeToolsVue from "./components/tree-tools.vue";
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils";
import addDeptVue from "./components/add-dept.vue";

export default {
  data() {
    return {
      departs: [],
      loading: false,
      defaultProps: {
        lable: "name",
      },
      company: {},
      showDialog: false,
      node: null,
    };
  },
  components: {
    treeToolsVue,
    addDeptVue,
  },
  created() {
    this.getDepartments();
  },
  methods: {
    async getDepartments() {
      this.loading = true;
      const result = await getDepartments();
      this.company = { name: result.companyName, manager: "负责人", id: "" };
      this.departs = tranListToTreeData(result.depts, "");
      console.log(result);
      this.loading = false;
    },
    addDepts(node) {
      this.node = node;
      this.showDialog = true;
    },
    editDepts(node) {
      this.node = node;
      this.showDialog = true;
      this.$refs.addDept.getDepartDetail(node.id);
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