<script setup lang="ts">
import { defineProps, onMounted, onUpdated, onBeforeUpdate, ref } from 'vue';
import { ThreeService } from '../services/three-service';
// import { GridGenerator } from '../utils/GridGenerator';

const props = defineProps<{ pawnSkinName: string, player: string }>()

const three = new ThreeService(true);

onMounted(()=> {
 
    // target DOM element
    const canvas = document.querySelector(`canvas#pawn-${props.player}`);
    three.init(canvas);
    three.loadPreviewPawn(props.pawnSkinName);
})

onBeforeUpdate(() => {
    three.resetPreviewPawn();
  })
onUpdated(()=> {
    three.loadPreviewPawn(props.pawnSkinName);
})

</script>

<template>
<canvas  loading :id="`pawn-${player}`" class="pawn-shader" width="150px" height="100px"></canvas>

</template>

<style scoped>

.pawn-shader{
    /* border: 1px solid black; */
    /* background-color: white; */
}

</style>