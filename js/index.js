import productModal from "./component/productModal.js";

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);

loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);

configure({
  generateMessage: localize("zh_TW"),
});

Vue.createApp({
  data() {
    return {
      loadingStatus: {
        loadingItem: "",
      },
      products: [],
      productID: "",
      carts: {},
      finalTotal: "",
      loadingItem: "",
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },
  methods: {
    getProducts() {
      axios
        .get(`${apiUrl}/v2/api/${apiPath}/products/all`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    openModal(id) {
      this.productID = id;
    },
    addToCart(product_id, qty = 1) {
      const data = {
        product_id,
        qty,
      };
      this.loadingItem = product_id;
      axios
        .post(`${apiUrl}/v2/api/${apiPath}/cart`, { data })
        .then((res) => {
          alert("成功加入購物車");
          this.$refs.userProductModal.hide();
          // this.$refs.userProductModal.openModal();
          this.loadingItem = "";
          this.getCartData();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getCartData() {
      axios
        .get(`${apiUrl}/v2/api/${apiPath}/cart`)
        .then((res) => {
          this.carts = res.data.data.carts;
          this.finalTotal = res.data.data.final_total;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    updateCart(cart) {
      const { product_id, qty } = cart;
      const data = {
        product_id,
        qty,
      };
      this.loadingItem = cart.id;
      axios
        .put(`${apiUrl}/v2/api/${apiPath}/cart/${cart.id}`, { data })
        .then((res) => {
          alert(res.data.message);
          this.loadingItem = "";
          this.getCartData();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    cleanAllCart() {
      axios
        .delete(`${apiUrl}/v2/api/${apiPath}/carts`)
        .then((res) => {
          alert(res.data.message);
          this.getCartData();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    deleteOneCart(cart_id) {
      this.loadingItem = cart_id;
      axios
        .delete(`${apiUrl}/v2/api/${apiPath}/cart/${cart_id}`)
        .then((res) => {
          alert(res.data.message);
          this.loadingItem = "";
          this.getCartData();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    createOrder() {
      console.log("createOrder");
      const order = this.form;
      axios.post(`${apiUrl}/v2/api/${apiPath}/order`,{data:order})
            .then(res=>{
              alert(res.data.message);
              this.$refs.form.resetForm();
              this.getCart();
            })
            .catch((err) => {
              alert(err.response.data.message);
            });
    },
  },
  components: {
    productModal,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  mounted() {
    this.getProducts();
    this.getCartData();
  },
})
.mount("#app");
