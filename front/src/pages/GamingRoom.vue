<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted,  ref} from 'vue';
import { ThreeService } from '../services/three-service'
import { useStore } from 'vuex';
import {STATUSES} from '../models/GameService.ts';
import { localStorageService } from '../services/storage-local-service';
import {httpService} from "../services/http-service.ts";
import {Subscritpions} from "../services/subscritpions.ts";

const router = useRoute();
const store = useStore();
const teams = ref([]);
const kings = ref([]);
const pawns = ref([]);
const gameInformation = ref({});

Subscritpions.subGame(router.params.id, setUpdatedGameInfo );
Subscritpions.subTeams(router.params.id, setTeamsInfo );
Subscritpions.subPawns(router.params.id, setPawnsInfo );



function setUpdatedGameInfo (payload) {
  console.log('for game',{payload});
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

function selectTeam(teamName: string) {
    localStorageService.saveTeam(teamName);
    store.dispatch('selectTeam', {id: router.params.id, teamName })
}

onMounted(async ()=> {
  const {kings, pawns, teams, ...gameInformation} = await httpService.get('/games', {id:router.params.id})
  setKingsInfo(kings)
  setPawnsInfo(pawns)
  setTeamsInfo(teams)
  setUpdatedGameInfo(gameInformation)
})

const three = new ThreeService();

</script>

<template>
    <h1> Top Cap duel</h1>
    <p>Equipe :
      {{teams[0]?.name}}
    </p>
    <p>Versus</p>
    <p>Equipe :
      {{teams[1]?.name}}
    </p>
    <h2 v-if="gameInformation?.status === STATUSES.STARTED">C'est à l'équipe {{ gameInformation?.active_team }} de jouer</h2>

    <section v-if="gameInformation?.status !== STATUSES.STARTED && gameInformation?.game_mode !== 'local'">
        <h2>Choix de l'équipe</h2>
        <button v-for="team in teams" :onclick="()=>selectTeam(team.name)" class="button-choice">
            <p>{{team.name}}</p>
            <img class="computeur-icon" src="/assets/avatars/nut-face.png" alt="computeur image" />
        </button>
    </section>
    <section v-else>
        <canvas  :id="game" class="pawn-shader" ></canvas>
    </section>

    <button :onclick="() => router.go(-1)">back</button>

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