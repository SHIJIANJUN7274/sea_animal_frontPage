"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      searchKey: "",
      // 搜索关键字
      currentPage: 1,
      // 当前页码
      pageSize: 6,
      // 每页数量
      totalPage: 0,
      // 总页数
      goodsList: [],
      // 商品列表数据
      status: "noMore",
      // 加载更多状态
      contentText: {
        // 加载更多文本提示
        contentdown: "上拉加载更多",
        contentrefresh: "加载中",
        contentnomore: "没有更多"
      }
    };
  },
  onReachBottom() {
    if (this.currentPage < this.totalPage) {
      this.currentPage++;
      this.getPageQueryByGoods();
    } else {
      this.status = "noMore";
    }
  },
  methods: {
    toBack() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    toDetail(id) {
      common_vendor.index.navigateTo({
        url: "/pages/detail/detail?id=" + id
      });
    },
    getPageQueryByGoods() {
    },
    search() {
      this.goodsList = [];
      this.currentPage = 1;
      this.status = "contentdown";
      this.getPageQueryByGoods();
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
    a: common_vendor.o((...args) => $options.search && $options.search(...args)),
    b: $data.searchKey,
    c: common_vendor.o(($event) => $data.searchKey = $event.detail.value),
    d: common_vendor.o((...args) => $options.search && $options.search(...args)),
    e: common_vendor.f($data.goodsList, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.goodsName),
        c: common_vendor.t(item.price.toFixed(2).split(".")[0]),
        d: common_vendor.t(item.price.toFixed(2).split(".")[1]),
        e: common_vendor.t(item.sales),
        f: index,
        g: common_vendor.o(($event) => $options.toDetail(item.goodsId), index)
      };
    }),
    f: common_vendor.p({
      status: $data.status,
      ["icon-size"]: 16,
      ["content-text"]: $data.contentText
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
