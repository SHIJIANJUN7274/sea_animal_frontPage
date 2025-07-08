"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      user: {
        username: "",
        password: "",
        repeatPassword: ""
      }
    };
  },
  onLoad() {
  },
  methods: {
    login() {
      if (this.user.username !== "" && this.user.password !== "") {
        common_vendor.index.request({
          url: "http://localhost:8080/wxUser/login",
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: {
            username: this.user.username,
            password: this.user.password
          },
          success: (res) => {
            if (res.data.code == 200) {
              common_vendor.index.showToast({
                icon: "success",
                title: res.data.message
              });
              common_vendor.index.setStorageSync("data", res.data.data);
              this.toIndex();
            } else {
              common_vendor.index.showToast({
                icon: "none",
                title: res.data.message
              });
            }
          },
          fail: () => {
          },
          complete: () => {
          }
        });
      } else {
        common_vendor.index.showToast({
          icon: "none",
          title: "用户名密码不为空"
        });
      }
    },
    toIndex() {
      common_vendor.index.reLaunch({
        url: "/pages/index/index",
        success: (res) => {
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    },
    toRegister() {
      common_vendor.index.navigateTo({
        url: "/pages/register/register",
        success: (res) => {
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      type: "contact",
      size: "24",
      color: "rgb(247,120,172)"
    }),
    b: $data.user.username,
    c: common_vendor.o(($event) => $data.user.username = $event.detail.value),
    d: common_vendor.p({
      type: "eye",
      size: "24",
      color: "rgb(247,120,172)"
    }),
    e: $data.user.password,
    f: common_vendor.o(($event) => $data.user.password = $event.detail.value),
    g: common_vendor.o((...args) => $options.toRegister && $options.toRegister(...args)),
    h: common_vendor.o((...args) => $options.login && $options.login(...args)),
    i: common_vendor.p({
      type: "qq",
      size: "40",
      color: "rgb(66,157,250)"
    }),
    j: common_vendor.p({
      type: "weixin",
      size: "40",
      color: "rgb(2,187,17)"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
