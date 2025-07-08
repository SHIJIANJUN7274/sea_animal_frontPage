"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      // 2.保存后端服务器返回的 所有的轮播图的数据 
      banners: [],
      goodsList: [],
      currentPage: 1,
      totalPages: 1,
      pageSize: 6,
      status: "more",
      contentText: {
        contentdown: "上拉加载更多",
        contentrefresh: "正在加载",
        contentnomore: "没有更多数据"
      }
    };
  },
  onLoad() {
    this.getBanners();
  },
  created() {
    this.getPageByGoods();
  },
  // 下拉刷新 自动触发
  onPullDownRefresh() {
    console.log("开启下拉刷新");
    this.goodsList = [];
    this.currentPage = 1;
    this.getPageByGoods();
  },
  // 下拉触底 自动触发
  onReachBottom() {
    console.log("下拉触底");
    if (this.currentPage >= this.totalPages) {
      common_vendor.index.showToast({
        icon: "none",
        title: "没有下一页数据了"
      });
      this.status = "no-more";
    } else {
      console.log("有下一页数据");
      this.currentPage++;
      this.getPageByGoods();
    }
  },
  methods: {
    getBanners() {
      const token = common_vendor.index.getStorageSync("data");
      console.log("token为" + token);
      if (!token) {
        common_vendor.index.showToast({
          icon: "none",
          title: "请先登录"
        });
        return;
      }
      common_vendor.index.request({
        url: "http://159.75.174.133:8080/banner/findbanner",
        method: "GET",
        data: {},
        header: {
          // 'Authorization': 'Bearer ' + token
          "Authorization": token
        },
        success: (res) => {
          console.log(res.data.data);
          this.banners = res.data.data;
        },
        fail: () => {
          common_vendor.index.showToast({
            icon: "none",
            title: "获取Banner失败"
          });
        }
      });
    },
    toSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/search/search",
        success: (res) => {
        },
        fail: () => {
        },
        complete: () => {
        }
      });
    },
    getPageByGoods() {
      this.status = "loading";
      const token = common_vendor.index.getStorageSync("data");
      console.log("token" + token);
      if (!token) {
        common_vendor.index.showToast({
          icon: "none",
          title: "请先登录"
        });
        return;
      }
      common_vendor.index.request({
        url: "http://159.75.174.133:8080/goods/getPageByGoods",
        method: "GET",
        data: {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        },
        header: {
          "Authorization": token
        },
        success: (res) => {
          common_vendor.index.stopPullDownRefresh();
          console.log("每页记录数为：", res.data.data.records.length);
          console.log("每页记录数为：", res.data.data.size);
          console.log("当前页数为：", res.data.data.current);
          console.log("总页数为：", res.data.data.pages);
          if (res.data.code === 200) {
            for (var i = 0; i < res.data.data.records.length; i++) {
              this.goodsList.push(res.data.data.records[i]);
            }
            this.currentPage = res.data.data.current;
            this.totalPages = res.data.data.pages;
            this.status = "more";
          } else {
            common_vendor.index.showToast({
              title: "获取商品列表失败",
              icon: "none"
            });
          }
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.getPageByGoods(this.currentPage - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.getPageByGoods(this.currentPage + 1);
      }
    },
    toDetail(id) {
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail?id=" + id
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  _easycom_uni_load_more2();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  _easycom_uni_load_more();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.toSearch && $options.toSearch(...args)),
    b: common_vendor.f($data.banners, (item, index, i0) => {
      return {
        a: item.imgurl,
        b: index
      };
    }),
    c: common_vendor.f($data.goodsList, (item, k0, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.goodsName),
        c: common_vendor.t(item.price.toFixed(2).split(".")[0]),
        d: common_vendor.t(item.price.toFixed(2).split(".")[1]),
        e: common_vendor.t(item.sales),
        f: item.goodsId,
        g: common_vendor.o(($event) => $options.toDetail(item.goodsId), item.goodsId)
      };
    }),
    d: common_vendor.p({
      status: $data.status,
      ["icon-size"]: 16,
      ["content-text"]: $data.contentText
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
