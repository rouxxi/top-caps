<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router';
import {computed, onMounted, ref, watch} from 'vue';
import { RawTeam, STATUSES} from '../services/GameService.ts';
import GameOverview from '../components/GameOverview.vue';
import {httpService} from "../services/http-service.ts";
import {Subscritpions} from "../services/subscritpions.ts";
import {userService} from "../services/user-servive.ts";

const route = useRoute();
const router = useRouter();
const teams = ref([]);
const kings = ref([]);
const pawnToUpdate = ref();
const gameInformation = ref({});

Subscritpions.subGame(route.params.id, setUpdatedGameInfo);
Subscritpions.subTeams(route.params.id, setTeamsInfo );
Subscritpions.subPawns(route.params.id, setPawnsInfo );

const game = ref();

watch([teams,kings, pawnToUpdate, gameInformation ],  async (payload)=> {
  game.value = await httpService.get('/games', {id: route.params.id});
})

function setUpdatedGameInfo (payload) {
  gameInformation.value = payload;
}

function setPawnsInfo (payload) {
  pawnToUpdate.value = payload;
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
      && game.value?.kings?.length > 0;
}

const imInTheGame = computed(() => {
  return game.value?.teams?.find((team: RawTeam)=> team.user_id === userService.me)
})

onMounted(async ()=> {
  game.value = await httpService.get('/games', {id:route.params.id})
})

async function selectTeam (teamId: number) {
  await httpService.put('/teams', {id: teamId, user_id: userService.me || null, selected: true})
}

</script>

<template>
    <h1> Top Cap duel</h1>
     <section v-if=" game?.game_mod === 'distant' && !imInTheGame">
        <h2>Choix de l'équipe</h2>
       <articles v-for="team in game?.teams">
         <button v-if="!team.selected"  :onclick="()=>selectTeam(team.id)" class="button-choice">
           <p>{{team.name}}</p>
           <img class="team-icon" src="/assets/avatars/nut-face.png" alt="computeur image" />
         </button>
       </articles>
     </section>
    <h2 v-if="game?.status === STATUSES.STARTED">C'est à l'équipe {{ game?.active_team }} de jouer</h2>
    <GameOverview v-if="isInformationLoaded() && imInTheGame" :game="game" :pawnToUpdate/>

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