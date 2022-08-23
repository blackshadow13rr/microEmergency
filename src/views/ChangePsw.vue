<template>
  <div id="Container">
    <el-dialog v-model="dialogFormVisible" width="600px">
      <el-form class="login-box1" label-width="100px">
        <h3 class="login-title">修改密码</h3>
        <el-form-item label="原密码" prop="password">
          <el-input
            type="password"
            show-password
            auto-complete="off"
            placeholder="请输入原密码"
            v-model="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            type="password"
            show-password
            auto-complete="off"
            placeholder="请设置新密码"
            v-model="newPassword"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            type="password"
            show-password
            auto-complete="off"
            placeholder="请确认新密码"
            v-model="confirmPassword"
          ></el-input>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="handlechangepwd">确定</el-button
          ><el-button type="primary" @click="handleLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ChangePwd } from "@/../api/admin";
import { UserFilled } from "@element-plus/icons-vue";
import { $EleMsgNotifyError, $EleMsgNotifySuccess } from "../../utils/alert";
export default {
  name: "ChangePsw",
  setup() {
    const store = useStore();
    let router = useRouter();
    let data = reactive({
      dialogFormVisible: true,
      username: "",
      password: "",
      region: "",
      newPassword: "",
      confirmPassword: "",
    });
    let getoldPsw = computed(() => {
      return store.state.userdata.oldpassword;
    });
    let getusername = computed(() => {
      return store.state.userdata.username;
    });
    let handlechangepwd = async () => {
      console.log(getusername);
      if (data.password == getoldPsw.value) {
        if (data.newPassword == data.confirmPassword) {
          data.username = getusername.value;
          console.log(data.username);
          console.log(data.newPassword);
          let status = await ChangePwd(data);
          console.log(status);
          if (status) {
            $EleMsgNotifySuccess("修改成功，即将返回登录页...");
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          } else {
            $EleMsgNotifyError("修改失败");
          }
        } else {
          $EleMsgNotifyError("两次密码不一致，请重新输入");
        }
      } else {
        $EleMsgNotifyError("原密码错误！");
      }
    };
    let handleLogin = () => {
      data.password = "";
      data.newPassword = "";
      data.confirmPassword = "";
    };
    return { ...toRefs(data), handlechangepwd, getusername, handleLogin };
  },
};
</script>

<style lang="scss" scoped>
.user-account-key {
  width: 500px;
  margin: 10px auto;
}
.login-box1 {
  width: 500px;
  height: 340px;
  margin: 0px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
}
.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>