<script setup lang="ts">

import Parameters from "../components/Parameters.vue";
import GameRules from "../components/GameRules.vue";

</script>

<template>
    <section class="title-container">
        <h1>TOP CAP</h1>
        <p>(remastered by gwe gwe)</p>
    </section>
    <section class="container">
        <GameRules />
        <Parameters />

    </section>
        
</template>

<style scoped>
.container {
    display: grid;
    grid-gap: 2rem;
    /* text-align: center; */
    grid-template-columns: 0.4fr 1fr;
}
.title-container {
    text-align: center;

    h1 {
        font-size: 40px;
        margin-bottom: 0;
    }

    p {
        font-size: small;
    }
}

</style>