<script setup lang="ts">
import {ThreeService} from "../services/three-service.ts";
import {onMounted, onUpdated, useTemplateRef } from "vue";
import type {RawKing, RawPawn, RawTeam} from "../services/GameService.ts";
import {userService} from "../services/user-servive.ts";

const props = defineProps<{
  pawnToUpdate: RawPawn,
  game: {
    pawns: RawPawn[],
    kings: RawKing[],
    teams: RawTeam[],
    active_team: null | number,
    created_at: string,
    game_mod: string,
    grid: [number, number][],
    id: string,
    status: string,
  }
}>()
const three = new ThreeService();
const gameOverview = useTemplateRef('game-overview');


onMounted(()=> {
  if (gameOverview.value) {
    three.init(gameOverview.value)
    three.generateBattleField(props.game.grid)
    three.setUser(userService.me);
    three.generatePawns(props.game.pawns, props.game.teams);
    three.consumeGameInformation( {
      pawns: props.game.pawns,
      kings: props.game.kings,
      teams: props.game.teams,
      gameInformation: {
        active_team: props.game.active_team,
        game_mod: props.game.game_mod,
        grid: props.game.grid,
        id: props.game.id,
        status: props.game.status
      } })
  }
})

onUpdated( ()=> {
  if (props.pawnToUpdate) {
    three.applyPawnChangesFromDB(props.pawnToUpdate)
  }
  three.consumeGameInformation( {
    pawns: props.game.pawns,
    kings: props.game.kings,
    teams: props.game.teams,
    gameInformation: {
      active_team: props.game.active_team,
      game_mod: props.game.game_mod,
      grid: props.game.grid,
      id: props.game.id,
      status: props.game.status
    } })
  three.setUser(userService.me); // Peut être too much xD
})


</script>

<template>
  <canvas ref="game-overview" class="pawn-shader" width="900px" height="500px" ></canvas>

</template>

<style scoped>


</style>