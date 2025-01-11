<template>
  <!-- <v-container class="d-flex flex-column" fluid fill-height>
    <slot name="header" />
    <v-layout justify-center class="flex-grow">
      <v-flex fill-height>
        <slot name="content" />
      </v-flex>
    </v-layout>
  </v-container> -->
  <v-container fluid class="full-height">
    <slot name="header" />
    <v-row justify="center" class="flex-grow">
      <v-col cols="12" md="12">
        <slot name="content" />
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.flex-grow {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* 使content区域占满剩余高度 */
}

.v-flex {
  flex-grow: 1; /* 确保内容区域占满剩余空间 */
}
</style>