<template>
  <v-container class="sidebar-container" fluid>
    <slot name="header" />
    <v-row justify="center">
      <v-col cols="12" md="9">
        <slot name="content" />
      </v-col>
      <v-col cols="12" md="3">
        <div class="sidebar-fixed">
          <slot name="sidebar" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.sidebar-container{
  display: flex;
  flex-direction: column;
  position: relative;
}

/* .header-fixed {
  position: sticky;
  top: 0;
  width: 100%;
  background-color: #fff;
  padding: 10px 20px;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
} */
.sidebar-fixed{
  position: sticky;
  top: 125px;
  flex-grow: 1;
  height: calc(100vh - 125px);
  overflow-y: auto;
  padding: 0 5px;
}

</style>