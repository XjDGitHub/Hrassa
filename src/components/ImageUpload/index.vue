<template>
  <div>
    <el-upload
      list-type="picture-card"
      :on-preview="preview"
      :limit="1"
      action="#"
      :file-list="fileList"
      :class="{ disabled: fileComputed }"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :http-request="upload"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress
      v-if="showPercent"
      :percentage="percent"
      style="width: 180px"
    ></el-progress>
    <el-dialog title="预览图片" :visible.sync="showDialog">
      <img :src="imgUrl" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import COS from "cos-js-sdk-v5";
import { Upload } from "element-ui";
import { set } from "js-cookie";
var cos = new COS({
  SecretId: "AKIDud7LMAkNr8D4f2A3h8KI6g2NgmfKm00k", // 身份识别 ID
  SecretKey: "dooa7QVYcT6UdYMxMZiohOrBHAoada8X", // 身份密钥
});
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: "",
      currentFileUid: "",
      showPercent: false,
      percent: 0,
    };
  },
  methods: {
    preview(file) {
      this.imgUrl = file.url;
      this.showDialog = true;
    },
    changeFile(file, fileList) {
      if (!this.fileList.some((item) => item.uid === file.uid)) {
        this.fileList.push(file);
      }
    },
    handleRemove(file, fileList) {
      // 如果只有一个图片可以
      //   this.fileList = fileList;
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid);
    },
    beforeUpload(file) {
      //   console.log(file);
      const type = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!type.some((item) => item === file.type)) {
        this.$message.error("上传图片只能是 JPG、GIF、BMP、PNG 格式!");
        return false;
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.$message.error("图片大小最大不能超过5M");
        return false;
      }
      this.showPercent = true;
      this.currentFileUid = file.uid;
      return true;
    },
    // 自定义上传动作 有个参数 有个file对象，是我们需要上传到腾讯云服务器的内容
    upload(params) {
      //   console.log(params.file);
      if (params.file) {
        cos.putObject(
          {
            Bucket: "jxk-1317474672", // 存储桶
            Region: "ap-beijing", // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
            onProgress: (params) => {
              this.percent = params.percent * 100;
            },
          },
          (err, data) => {
            console.log(err || data);
            if (!err && data.statusCode === 200) {
              this.fileList = this.fileList.map((item) => {
                if (item.uid === this.currentFileUid) {
                  return { url: "http://" + data.Location, upload: true };
                }
              });
              setTimeout(() => {
                this.showPercent = false; // 隐藏进度条
                this.percent = 0; // 进度归0
              }, 2000);
            }
          }
        );
      }
    },
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1;
    },
  },
};
</script>

<style >
.disabled .el-upload--picture-card {
  display: none;
}
</style>