<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, onUpdated, ref, computed } from 'vue';
import { ThreeService } from '../services/three-service'
import { useStore } from 'vuex';
import {type GameInformation, GameService, gameService, STATUSES} from '../models/GameService.ts';
import { localStorageService } from '../services/storage-local-service';
import {httpService} from "../services/http-service.ts";

console.log('in script')
const router = useRoute();
const store = useStore();
const three = new ThreeService();

function selectTeam(teamName: string) {
    localStorageService.saveTeam(teamName);
    store.dispatch('selectTeam', {id: router.params.id, teamName })
}

onMounted(async ()=> {
  const config: GameInformation = await httpService.get('/games', {id:router.params.id})
  const game = new GameService()
  game.generateFromConfig(config)
  store.state.currentGame = game;
})

</script>

<template>
  <div v-if="store.state.currentGame">
    <h1> Top Cap duel</h1>
    <p>Equipe : {{ store.state.currentGame.teamNames?.[0] }}</p>
    <p>Versus</p>
    <p>Equipe : {{ store.state.currentGame.teamNames?.[1] }}</p>
    <h2 v-if="store.state.currentGame.status === STATUSES.STARTED">C'est à l'équipe {{ store.state.currentGame.activePlayer }} de jouer</h2>
  </div>

    <section v-if="store.state.currentGame.status !== STATUSES.STARTED && store.state.currentGame.gameMod !== 'local'">
        <h2>Choix de l'équipe</h2>
        <button v-for="team in store.state.currentGame.teams" :onclick="()=>selectTeam(team.name)" class="button-choice">
            <p>{{team.name}}</p>
            <img class="computeur-icon" src="/assets/avatars/nut-face.png" alt="computeur image" />
        </button>
    </section>
    <section v-else>
        <canvas  :id="`game`" class="pawn-shader" ></canvas>
    </section>

    <button :onclick="() => $router.go(-1)">back</button>

</template>

<style scoped>

.computeur-icon {
    width: 100px;
}

.button-choice {
    text-align: center;
    margin: 10px;
    padding: 1rem;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.5);
}

</style>