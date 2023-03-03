export default {
  props: ["id", "addToCart","openModal"],
  data() {
    return {
      modal: {},
      tempProduct: {},
    };
  },
  template: `#userProductModal`,
  watch: {
    id() {
      if (this.id) {
        axios
          .get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
          .then((res) => {
            this.tempProduct = res.data.product;
            this.modal.show();
          })
          .catch((err) => {
            alert(err.response.data.message);
          });       
      }
    },
  },
  methods: {
    hide () {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
    this.$refs.modal.addEventListener('hidden.bs.modal', (event)=>{
      this.openModal('');
    })
  },
};
