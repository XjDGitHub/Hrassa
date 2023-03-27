<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button icon="el-icon-plus" size="small" type="primary"
                >新增角色</el-button
              >
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                    >分配权限</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRol(row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                :total="page.total"
                :current-page="page.page"
                :page-size="page.pagesize"
                layout="prev,pager,next"
                @current-change="changeSize"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="formData.name"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="formData.companyAddress"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="formData.mailbox"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                  v-model="formData.remarks"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-dialog :visible="showDialog" @close="btnCancel">
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <el-row slot="footer">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible="showPermDialog" @close="btnPermCancel">
      <el-tree
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :check-strictly="true"
        node-key="id"
        :default-checked-keys="selectCheck"
        ref="permTree"
      ></el-tree>
      <el-row slot="footer">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK"
            >确定</el-button
          >
          <el-button size="small" @click="btnPermCancel"
            >取消</el-button
          ></el-col
        >
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  updateRole,
  getRoleDetail,
  addRole,
  assignPerm,
} from "@/api/setting";
import { mapGetters } from "vuex";
import { getPermissionList } from "@/api/permissson";
import { tranListToTreeData } from "@/utils";
export default {
  data() {
    return {
      list: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 0,
      },
      formData: {},
      showDialog: false,

      roleForm: {},
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
      // 分配权限数据
      showPermDialog: false,
      permData: [],
      defaultProps: {
        label: "name",
      },
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null, // 用来记录分配角色的id
    };
  },
  computed: {
    ...mapGetters(["companyId"]),
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page);
      this.page.total = total;
      this.list = rows;
    },
    changeSize(newSize) {
      this.page.page = newSize;
      this.getRoleList();
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId);
      console.log(this.formData);
    },
    async deleteRole(id) {
      try {
        await this.$confirm("确定删除该角色么");
        await deleteRole(id);
        this.getRoleList();
      } catch (error) {
        console.error();
      }
    },
    async editRol(id) {
      this.roleForm = await getRoleDetail(id);
      this.showDialog = true;
      console.log(this.roleForm);
    },
    btnCancel() {
      this.roleForm = {
        name: "",
        description: "",
      };
      this.$refs.roleForm.resetFields();
      this.showDialog = false;
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate();
        if (this.roleForm.id) {
          await updateRole(this.roleForm);
        } else {
          await addRole(this.roleForm);
        }
        this.getRoleList();
        this.$message.success("操作成功");
        this.showDialog = false;
      } catch (error) {
        console.error();
      }
    },
    async assignPerm(id) {
      this.permData = tranListToTreeData(await getPermissionList(id), "0");
      this.showPermDialog = true;
      const { permIds } = await getRoleDetail(id);
      this.selectCheck = permIds;
      this.roleId = id;
    },
    btnPermCancel() {
      this.selectCheck = [];
      this.showDialog = false;
    },
    async btnPermOK() {
      await assignPerm({
        permIds: this.$refs.permTree.getCheckedKeys(),
        id: this.roleId,
      });
      this.showDialog = false;
    },
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
};
</script>

<style scoped>
</style>