<script setup>
import { ref, watch } from "vue";
import debounce from "lodash.debounce";
import Map from "./components/ol-map/Map.vue";
import { NInput, NSelect, NButton } from "naive-ui";

const start = ref("");
const end = ref("");
const via = ref([]);
const type = ref("car");
const route = ref();

const fetchRoute = debounce((newStart, newEnd, newVia, newType) => {
  route.value = undefined;
  const routes = [newStart, ...newVia.filter(Boolean), newEnd].join(";");
  const url = `https://routing.openstreetmap.de/routed-${newType}/route/v1/driving/${routes}?geometries=geojson&overview=simplified`;
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res?.routes?.[0]) {
        route.value = res.routes[0];
      } else {
        alert(res.message || 'API Error');
      }
    });
}, 600);

watch(
  [start, end, via, type],
  ([newStart, newEnd, newVia, newType]) => {
    if (newStart && newEnd) {
      fetchRoute(newStart, newEnd, newVia, newType);
    }
  },
  { immediate: true, deep: true }
);

const options = [
  { label: "Driving", value: "car" },
  { label: "Walking", value: "foot" },
  { label: "Cycling", value: "bike" },
];

const addViaPoint = () => {
  via.value.push("");
};

const removeViaPoint = (index) => {
  via.value.splice(index, 1);
};
</script>

<template>
  <div class="control">
    <NInput v-model:value="start" placeholder="Start" clearable />

    <template v-for="(_, index) in via" :key="index">
      <NInput
        v-model:value="via[index]"
        placeholder="Via point"
        clearable
        v-on:clear="removeViaPoint(index)"
      />
    </template>

    <NInput v-model:value="end" placeholder="End" clearable />

    <div style="display: flex; gap: 0.25em">
      <NSelect v-model:value="type" :options="options" />
      <NButton type="info" @click="addViaPoint">Add Via Point</NButton>
    </div>

    <NInput v-if="route" :value="JSON.stringify(route)" readonly="" />
  </div>
  <Map v-if="start && end && route" :points="[start, end]" :route="route" />
</template>

<style lang="less" scoped>
.control {
  position: fixed;
  top: 0.5em;
  left: 2.5em;
  z-index: 11;
  display: flex;
  flex-direction: column;
  .n-input {
    width: 20em;
  }
}
</style>
