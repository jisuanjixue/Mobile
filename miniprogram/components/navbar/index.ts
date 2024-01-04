import { effect } from "../../miniprogram_npm/@preact/signals-core/index";
import deviceUtil from "../../miniprogram_npm/lin-ui/utils/device-util";
import utils from "../../utils/util";

Component({
  options: {
    styleIsolation: "isolated",
    multipleSlots: true
  },

  properties: {
    title: {
      type: String,
      value: ""
    },
    info: {
      type: String,
      value: ""
    },
    backImage: {
      type: String,
      value: ""
    },
    height: {
      type: Number,
      value: 0
    },
    hideLeftIcon: {
      type: Boolean,
      value: false
    },
    showSearch: {
      type: Boolean,
      value: false
    },
    showInfo: {
      type: Boolean,
      value: true
    },
    showDropDown: {
      type: Boolean,
      value: false
    },
    isLogin: {
      type: Boolean,
      value: false
    },
    itemValue: {
      type: String,
      value: ""
    },
    subjectTypeList: {
      type: Array,
      value: []
    }
  },

  lifetimes: {
    attached: function () {
      effect(() => {
        this.setData({
          capsuleBarHeight: deviceUtil.getNavigationBarHeight()
        });
      });
    }
  },
  methods: {
    handBack() {
      const url = utils.getCurrentPageUrl();
      if (url === "packageA/pages/login/login") {
        wx.switchTab({
          url: "/pages/index/index"
        });
      }
    },
    onSearchClick(e: any) {
      this.triggerEvent("onSearch", e.detail, {});
    },
    onComSearch(e: any) {
      this.triggerEvent("onComSearch", e.detail, {});
    },
    onTypeSelect(value: any) {
      this.triggerEvent("onTypeSelect", value.detail, {});
    }
  }
});
