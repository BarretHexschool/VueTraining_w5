import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import pagination from './component/pagination.js';
import productModal from './component/productModal.js';
import delProductModal from './component/delProductModal.js';


let productModalElement = '';
let delProductModalElement = '';

const app = {
    data() {
        return {
            products: [],
            tempProduct: {
                imagesUrl: [],
            },
            isNew: false,
            pageData:{},
        }
    },
    methods: {
        getProducts(page = 1) {
            axios.get(`${url}/v2/api/${path}/admin/products?page=${page}`)
                .then(res => {
                    this.products = res.data.products;
                    this.pageData = res.data.pagination;
                })
                .catch(err => {
                    alert(err.response.data.message);
                })
        },
        productDetail(product) {
            this.tempProduct = product;
        },
        updateProduct(){
            let urlStr = `${url}/v2/api/${path}/admin/product`;
            let type = 'post';

            if( !this.isNew ) {
                urlStr = `${url}/v2/api/${path}/admin/product/${this.tempProduct.id}`;
                type = 'put';
            }
            axios[type](urlStr, { data : this.tempProduct})
                        .then(res=>{
                            alert(res.data.message);
                            productModalElement.hide();
                            this.getProducts();
                        })
                        .catch(err=>{
                            alert(err.response.data.message);
                        })
        },
        delProduct(){
            axios.delete(`${url}/v2/api/${path}/admin/product/${this.tempProduct.id}`)
                    .then(res=>{
                        alert(res.data.message);
                        delProductModalElement.hide();
                        this.getProducts();
                    } 
                    )
                    .catch(err=>{
                        alert(err.responsel.data.message);
                        delProductModalElement.hide();
                    })
        },
        createImages(){
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.pus('');
        },
        openModal(modalStatus, item) {
            if (modalStatus === 'new') {
              this.tempProduct = {
                imagesUrl: [],
              };
              this.isNew = true;
              productModalElement.show();
            } else if (modalStatus === 'edit') {
              this.tempProduct = { ...item };
              this.isNew = false;
              productModalElement.show();
            } else if (modalStatus === 'delete') {
              this.tempProduct = { ...item };
              delProductModalElement.show()
            }
          },

    },
    components:{
        pagination,productModal,delProductModal
    },
    mounted() {
        // 登入驗證
        axios.post(`${url}/v2/api/user/check`)
            .then(res => {
                this.getProducts();
            })
            .catch(err => {
                window.location = 'index.html';
            });

        // 建立model實體
        productModalElement = new bootstrap.Modal(document.querySelector('#productModal'), {
            keyboard: false
        });
        delProductModalElement = new bootstrap.Modal(document.querySelector('#delProductModal'), {
            keyboard: false
        });


    },
}

createApp(app).mount('#app');
