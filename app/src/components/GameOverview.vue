<script setup lang="ts">
import {ThreeService} from "../services/three-service.ts";
import {onMounted, useTemplateRef} from "vue";
import type {RawKing, RawPawn, RawTeam, GameInformation} from "../services/GameService.ts";

const props = defineProps<{
  gameInformation: GameInformation | {},
  pawns: RawPawn[],
  kings: RawKing[],
  teams: RawTeam[]
}>()
const three = new ThreeService();
const gameOverview = useTemplateRef('game-overview');

onMounted(()=> {
  three.init(gameOverview.value)
  three.generateBattleField(props.gameInformation.grid)
  three.generatePawns(props.pawns, props.teams);
  three.consumeGameInformation( { gameInformation: props.gameInformation ,pawns: props.pawns, kings: props.kings, teams: props.teams})
})


</script>

<template>
  <canvas ref="game-overview" class="pawn-shader" width="900px" height="500px" ></canvas>

</template>

<style scoped>


</style>