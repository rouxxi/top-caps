<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import {computed, onMounted, ref, watch } from 'vue';
import {STATUSES} from '../services/GameService.ts';
import GameOverview from '../components/GameOverview.vue';
import {httpService} from "../services/http-service.ts";
import {Subscritpions} from "../services/subscritpions.ts";

const route = useRoute();
const router = useRouter();
const teams = ref([]);
const kings = ref([]);
const pawns = ref();
const gameInformation = ref({});

Subscritpions.subGame(route.params.id, setUpdatedGameInfo );
Subscritpions.subTeams(route.params.id, setTeamsInfo );
Subscritpions.subPawns(route.params.id, setPawnsInfo );

const game = ref();

watch([teams,kings, pawns, gameInformation ],  async (payload)=> {
  console.log('trigger watcher')
  console.log({payload})
  console.log([teams.value,kings.value, pawns.value, gameInformation.value ])
  const response = await httpService.get('/games', {id:route.params.id});
  console.log({response});
  game.value = response;
})

function setUpdatedGameInfo (payload) {
  gameInformation.value = payload;
}

function setPawnsInfo (payload) {
  pawns.value = payload;
}
function setTeamsInfo (payload) {
  teams.value = payload;
}
function setKingsInfo (payload) {
  kings.value = payload;
}

function isInformationLoaded () {
  return game.value?.status
      && game.value?.teams?.length > 0
      && game.value?.pawns?.length > 0
      && Object.keys(gameInformation.value).length > 0
      && game.value?.kings?.length > 0;
}

onMounted(async ()=> {
  const {kings, pawns, teams, ...gameInformation} = await httpService.get('/games', {id:route.params.id})
  setKingsInfo(kings)
  setPawnsInfo(pawns)
  setTeamsInfo(teams)
  setUpdatedGameInfo(gameInformation)
})

</script>

<template>
    <h1> Top Cap duel</h1>
    <h2 v-if="gameInformation?.status === STATUSES.STARTED">C'est à l'équipe {{ gameInformation?.active_team }} de jouer</h2>

    <section v-if="gameInformation?.status !== STATUSES.STARTED && gameInformation?.game_mode !== 'local'">
        <h2>Choix de l'équipe</h2>
        <button v-for="team in teams" :onclick="()=>selectTeam(team.name)" class="button-choice">
            <p>{{team.name}}</p>
            <img class="team-icon" src="/assets/avatars/nut-face.png" alt="computeur image" />
        </button>
    </section>
    {{isInformationLoaded()}}
    {{game}}
    <GameOverview v-if="isInformationLoaded()" :game="game" :pawnToUpdate="pawns"/>

    <button :onclick="() => router.go(-1)">back</button>

</template>

<style scoped>

.team-icon {
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