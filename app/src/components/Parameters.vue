<script setup lang="ts">
import {ref} from "vue";
import PawnPreview from "./PawnPreview.vue";
import gltfFilesFormat from "../configs/gltf-files-format";
import { useStore } from "vuex";
import { useRouter } from "vue-router";


const pawnsConfigName = gltfFilesFormat.keys(); 
const pawnSkinNamePlayer1 = ref<string>(pawnsConfigName[0]);
const pawnSkinNamePlayer2 = ref<string>(pawnsConfigName[1]);

const teamName1 = ref('');
const teamName2 = ref('');
const gamePreSet = ref(1);
const gameMod = ref('distant');


const router = useRouter()
const store = useStore()

async function submit (event: Event) {
    event.preventDefault();
  

    const gameConfig = {
      preset: gamePreSet.value,
      game_mod: gameMod.value,
      teams: [
        {name: teamName1.value, pawns_skin:pawnSkinNamePlayer1.value },
        {name: teamName2.value, pawns_skin:pawnSkinNamePlayer2.value }
      ]
    };

    const id = await store.dispatch('createGame', gameConfig);

    if (id) {
      await router.push(`/gaming-room/${id}`);
    }
}

function setPlayerName1 (event) {
  teamName1.value = event.target.value;
}
function setPlayerName2 (event) {
  teamName2.value = event.target.value;
}

function selectSkinPawnPlayer1 (event) {
    pawnSkinNamePlayer1.value = event.target.value
}

function selectSkinPawnPlayer2 (event) {
    pawnSkinNamePlayer2.value = event.target.value
}

function selectPreset (event) {
   gamePreSet.value = event.target.value
}

function selectDistantMod (event:Event) {
  event.preventDefault();
  gameMod.value = 'distant';
}

function selectLocalMod (event:Event) {
  event.preventDefault();

  gameMod.value = 'local';
}

</script>

<template>
    <section class="parameters-container">
        <h2>Paramètre de la partie</h2>
        <form class="settings-form" >
            <articles class="player1">
                <h3>Joueur 1</h3>
                <label for="team-name">Nom de l'équipe</label>
                <input id="team-name" :value="teamName1" :onchange="setPlayerName1" type="text" placeholder="Team 1"/>

                <label for="pawn-skin-player-1">Pion</label>
                
                <select id="pawn-skin-player-1" @change="selectSkinPawnPlayer1">
                    <option v-for="name in pawnsConfigName" :value="name" :key="name"> {{name}} </option>
                </select>
                <PawnPreview player="player-1" :pawnSkinName="pawnSkinNamePlayer1" />
            </articles>

            <articles class="player2">
                <h3>Joueur 2</h3>
                <label for="team-name">Nom de l'équipe</label>
                <input id="team-name" :value="teamName2" :onchange="setPlayerName2" type="text" placeholder="Team 2"/>

                <label for="pawn-skin-player-1">Pion</label>
                
                <select id="pawn-skin-player-1" @change="selectSkinPawnPlayer2">
                    <option v-for="name in pawnsConfigName" :value="name" :key="name"> {{name}} </option>
                </select>
                <PawnPreview player="player-2" :pawnSkinName="pawnSkinNamePlayer2" />
            </articles>

            <section class="game-presets">
                <label for="game-preset-option">Positionnnement de départ</label>
                <select id="game-preset-option" @change="selectPreset">
                    <option value=1 >Position 1</option>
                    <option value=2 >Position 2</option>
                    <option value=3 >Position 3</option>
                </select>
                <img class="game-presets-image" src="/assets/presets.png" alt="image d'aide pour les règles" />
            
            </section>
            <section  class="game-mod">
              <h2>Mode de la partie</h2>

              <button :onclick="selectLocalMod" class="button-choice" >
                <p>Partie locale</p>
                <img class="computeur-icon" src="/assets/screen-image.png" alt="computeur image" />
              </button>
              <button :onclick="selectDistantMod" class="button-choice">
                <p>Partie à distance</p>
                <img class="computeur-icon" src="/assets/screen-image.png" aria-hidden />
                <img class="computeur-icon" src="/assets/screen-image.png" aria-hidden />
              </button>
            </section>
            <button :onclick="submit" class="submit-button" > Commencer </button>
        </form>
    </section>

</template>

<style scoped>
.parameters-container {
    background-color: rgb(50, 49, 90);
    padding: 1rem;
    width: fit-content;  
}

.settings-form {
    display: grid;
    grid-gap: 5px;
    grid-template-areas: 
    "player1  preset"
    "player2  preset"
    "gameMod submit"
    ;
    grid-template-columns: 1fr 0.5fr;
    grid-template-rows: 1fr 1fr 0fr;


    .player1 {
        grid-area: player1;
    }
    
    .player2 {
        grid-area: player2;
    }
  .game-mod {
    grid-area: gameMod;
  }
    .submit-button {
        grid-area: submit;
        height: fit-content;
        max-width: 250px;
        margin: 1rem;
    }
    
    .game-presets {
        grid-area: preset;
        display: flex;
        flex-direction: column;
        #game-preset-option {
            width: 100px;
        }

    }
            
    .game-presets-image {
        /* rotate: -90deg; */
        width: 250px;
    }

    .computeur-icon {
      width: 70px;
    }

    .button-choice {
      text-align: center;
      margin: 10px;
      padding: 1rem;
      border-radius: 10px;
      background-color: rgba(255, 255, 255, 0.5);
    }
}
</style>