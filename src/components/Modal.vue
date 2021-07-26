<template>
  <div>
    <v-dialog width="300" persistent v-model="isOpen">
      <v-card>
        <v-card-title class="headline justify-center">
          {{ title }}
        </v-card-title>
        <v-card-text class="text-center">
          {{ message }}
        </v-card-text>
        <v-card-actions>
          <v-btn depressed class="mx-2" @click="onYes()"> Yes </v-btn>

          <v-spacer></v-spacer>

          <v-btn depressed class="mx-2" @click="onNo()"> No </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
@Component({
  name: "Modal",
})
export default class Modal extends Vue {
  @Prop({ default: '' }) title!: string;
  @Prop({ default: '' }) message!: string;
  @Prop({ default: false }) isOpen!: boolean;
  @Emit('handleNo') onNo() {}
  @Emit('handleYes') onYes() {} 
}
</script>