"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      password: "",
      repeatPassword: ""
    };
  },
  onLoad() {
  },
  methods: {
    register() {
      if (this.username !== "" && this.password !== "") {
        if (this.password === this.repeatPassword) {
          common_vendor.index.request({
            url: "http://localhost:8080/wxUser/register",
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            data: {
              username: this.username,
              password: this.password
            },
            success: (res) => {
              if (res.data.code == 200) {
                common_vendor.index.showToast({
                  icon: "success",
                  title: res.data.data
                });
                setTimeout(() => {
                  common_vendor.index.navigateTo({
                    url: "/pages/login/login",
                    success: (res2) => {
                    },
                    fail: () => {
                    },
                    complete: () => {
                    }
                  });
                }, 2e3);
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
            title: "密码和确认密码要一致"
          });
        }
      } else {
        common_vendor.index.showToast({
          icon: "none",
          title: "用户名密码不为空"
        });
      }
    },
    toLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login",
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
    b: $data.username,
    c: common_vendor.o(($event) => $data.username = $event.detail.value),
    d: common_vendor.p({
      type: "eye",
      size: "24",
      color: "rgb(247,120,172)"
    }),
    e: $data.password,
    f: common_vendor.o(($event) => $data.password = $event.detail.value),
    g: common_vendor.p({
      type: "eye",
      size: "24",
      color: "rgb(247,120,172)"
    }),
    h: $data.repeatPassword,
    i: common_vendor.o(($event) => $data.repeatPassword = $event.detail.value),
    j: common_vendor.o((...args) => $options.toLogin && $options.toLogin(...args)),
    k: common_vendor.o((...args) => $options.register && $options.register(...args)),
    l: common_vendor.p({
      type: "qq",
      size: "40",
      color: "rgb(66,157,250)"
    }),
    m: common_vendor.p({
      type: "weixin",
      size: "40",
      color: "rgb(2,187,17)"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bac4a35d"]]);
wx.createPage(MiniProgramPage);
