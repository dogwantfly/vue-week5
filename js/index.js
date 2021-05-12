import pagination from './components/pagination.js';
import productModal from './components/product-modal.js';
VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('required', VeeValidateRules['required']);
VeeValidate.defineRule('min', VeeValidateRules['min']);
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});
const app = Vue.createApp({
  data() {
    return {
      user: {
        email: '',
        tel: '',
        name: '',
        region: '',
        address: '',
        payment: ''
      },
      message: '',
      products: {},
      carts: {},
      pagination: '',
      tempProduct: {},
      loadingStatus: {},
      coupon_code: ''
    }
  },
  methods: {
    // 取得商品列表
    getProduct(page = 1) {
      const api = `/api/${apiPath}/products?page=${page}`;
      axios.get(api)
        .then(response => {
          if (!response.data.success) return;
            this.products = response.data.products;
            this.pagination = response.data.pagination;
        })
        .catch(error => {
            console.log(error);
        })
    },
    // 商品細節
    getProductInfo(item) {
      this.tempProduct = { ...item };
      const id = this.tempProduct.id;
      const api = `/api/${apiPath}/product/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.get(api)
        .then(response => {
          if (!response.data.success) {
            alert(response.data.message);
            return;
          }
          this.loadingStatus.loadingItem = '';
          this.$refs.productModal.openModal();
        })
        .catch(error => {
            console.log(error);
        })
    },
    // 加入購物車
    addCart(id, qty = 1) {
      const api = `/api/${apiPath}/cart`;
      const data = {
        product_id: id,
        qty
      }
      this.loadingStatus.loadingCart = id;
      this.$refs.productModal.hideModal();
      axios.post(api,{data})
        .then(response => {
          if (!response.data.success) {
            alert(response.data.message);
            return;
          }
          this.getCart();
          this.loadingStatus.loadingCart = '';
        })
        .catch(error => {
            console.log(error);
        })
    },
    // 取得購物車
    getCart() {
      const api = `/api/${apiPath}/cart`;
      axios.get(api)
      .then(response => {
        if (!response.data.success) return;
        this.carts = response.data.data;
      })
      .catch(error => {
          console.log(error);
      })
    },
    // 移除購物車
    removeCartItem(id) {
      const api = `/api/${apiPath}/cart/${id}`;
      this.loadingStatus.loadingRemoveCart = id;
      axios.delete(api)
      .then(response => {
        if (!response.data.success) return;
        this.getCart();
        this.loadingStatus.loadingRemoveCart = '';
      })
      .catch(error => {
          console.log(error);
      })
    },
    // 套用優惠券
    addCoupon () {
      const api = `/api/${apiPath}/coupon`;
      const data = {
        code: this.coupon_code
      }
      this.loadingStatus.loadingCoupon = this.coupon_code;
      axios.post(api,{data})
        .then(response => {
          if (!response.data.success) {
            this.loadingStatus.loadingCoupon = '';
            alert(response.data.message);
            return;
          }
          this.getCart();
          this.loadingStatus.loadingCoupon = '';
        })
        .catch(error => {
            console.log(error);
        })
    },
    // 建立訂單
    addOrder (values,{resetForm}) {
      const api = `/api/${apiPath}/order`;
      const data = {
        user: this.user,
        message: this.message
      }
      axios.post(api,{data})
        .then(response => {
          console.log(response)
          alert(response.data.message);
          if (response.data.success) {
            this.user = {
              email: '',
              tel: '',
              name: '',
              region: '',
              address: '',
              payment: ''
            };
            this.message = '';
            resetForm();
          }
        })
        .catch(error => {
            console.log(error);
        })
    },
  },
  mounted() {
    this.getProduct();
    this.getCart();
  }
});
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.component('pagination', pagination)
app.component('product-modal', productModal)
app.mount('#app');