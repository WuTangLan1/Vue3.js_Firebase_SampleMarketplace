<template>
    <div class="products-view-container">
      <categoryManage></categoryManage>
      <ProductTable></ProductTable>
    </div>
</template>

<script>
import ProductTable from '@/components/products/ProductTable.vue';
import categoryManage from '@/components/categories/categoryManage.vue';

export default {
    components : {
        ProductTable,
        categoryManage
    }
}
</script>

<style>
.products-view-container {
  padding: 3% 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  background-color: #f3f4f6;  /* Soft background color for differentiation */
}
</style>
