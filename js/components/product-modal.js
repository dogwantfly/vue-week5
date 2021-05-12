export default {
  props: ['temp-product'],
  template: '#productModal',
  data() {
    return {
      modal: null,
      qty: 1
    }
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    }
  },
  mounted() {
    // 建立 instance
    this.modal = new bootstrap.Modal(this.$refs.modal, {
      keyboard: false
    });
  }
}