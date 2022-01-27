<template>
  <v-card class="cardRadius">
    <v-row v-if="loading" class="no-gutters">
      <v-col cols="12" sm="3" md="3">
        <div class="fill-height d-flex pa-5" :class="color">
          <v-skeleton-loader type="avatar"></v-skeleton-loader>
        </div>
      </v-col>
      <div class="col pa-3 py-4" :class="`${color}--text`">
        <v-skeleton-loader type="list-item-two-line"></v-skeleton-loader>
      </div>
    </v-row>
    <v-row v-else class="no-gutters">
      <v-col :cols="full ? 3 : 12" sm="3" md="3">
        <div class="fill-height d-flex justify-center" :class="color">
          <v-icon size="35" color="white" v-text="icon"> </v-icon>
        </div>
      </v-col>
      <v-col
        :cols="full ? 9 : 12"
        sm="9"
        md="9"
        class="pa-3 py-4"
        :class="`${color}--text`"
      >
        <h5 class="text-truncate text-uppercase" v-text="title"></h5>
        <h1 v-text="total"></h1>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    color: String,
    icon: String,
    title: String,
    total: Number,
    full: {
      default: true,
      type: Boolean,
    },
  },
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
};
</script>

<style>
.cardRadius {
  border-radius: 0px;
}

.cardRadius .fill-height {
  border-radius: 0px 0 0 0px;
}
</style>
