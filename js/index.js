import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const productModal = {
  props: ["id", "addToCart"],
  data() {
    return {
      modal: {},
      tempProduct: {},
    };
  },
  template: `#userProductModal`,
  watch: {
    id() {
      console.log(this.id);
      axios
        .get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
        .then((res) => {
          this.tempProduct = res.data.product;
          this.modal.show();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
};
const app = {
  data() {
    return {
      products: [],
      productID: "",
      carts: {},
      finalTotal: "",
    };
  },
  methods: {
    getProducts() {
      axios
        .get(`${apiUrl}/v2/api/${apiPath}/products/all`)
        .then((res) => {
          this.products = res.data.products;
          console.log(this.products);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    openModal(id) {
      this.productID = id;
      console.log("註冊", id);
    },
    addToCart(product_id, qty = 1) {
      const data = {
        product_id,
        qty,
      };
      axios
        .post(`${apiUrl}/v2/api/${apiPath}/cart`, { data })
        .then((res) => {
          alert("成功加入購物車");
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
    upDateCart(cart) {
      console.log(cart);
    },
  },
  components: {
    productModal,
  },
  mounted() {
    this.getProducts();
    this.getCartData();
  },
};

createApp(app).mount("#app");
