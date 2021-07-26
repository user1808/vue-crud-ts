<template>
  <div>
    <h1 class="text-center">{{ message }}</h1>

    <v-container class="my-6" v-if="logged">
      <v-btn
        depressed
        class="primary black--text my-3"
        router
        :to="{ name: 'PersonDetail', params: { id: 'new' } }"
      >
        <v-icon left>mdi-plus</v-icon>
        <span>Add new person</span>
      </v-btn>

      <v-expansion-panels>
        <v-expansion-panel v-for="(person, index) in people" :key="index">
          <v-expansion-panel-header class="h2">
            {{ person.fullName }}
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-card flat>
              <v-card-text class="px-2">
                <div class="label">Mail</div>
                <div class="body">
                  {{ person.email }}
                </div>
                <div class="label pt-2">Phone</div>
                <div class="body">
                  {{ formatPhoneNumber(person.phone) }}
                </div>
                <div class="label pt-2">Birthday</div>
                <div class="body">
                  {{ formatDate(person.birthDate) }}
                </div>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  depressed
                  class="primary black--text mr-4"
                  router
                  :to="{ name: 'PersonDetail', params: { id: person.id } }"
                >
                  Edit
                </v-btn>

                <v-btn
                  depressed
                  color="primary black--text"
                  @click="askToDelete(person)"
                >
                  <v-icon left>mdi-delete</v-icon>
                  <span>Delete</span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <Modal
        :isOpen="showDeletePopup"
        :title="'Delete Person'"
        :message="modalMessage"
        @handleNo="closeModal"
        @handleYes="deletePerson"
      />
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import { mapActions } from "vuex";
import mixinForViews from "../shared/mixinForViews";
import Modal from "../components/Modal.vue";
import Person from "@/shared/person";

@Component({
  name: "CrudView",
  components: { Modal },
  methods: {
    ...mapActions(["deletePersonAction"]),
  },
})
export default class CrudView extends mixins(mixinForViews) {
  deletePersonAction!: ({ person, token } : {person: Person, token: string}) => Promise<void>;

  showDeletePopup: boolean = false;
  personToDelete: Person | null = null;

  get modalMessage(): string {
    const name: string =
      this.personToDelete && this.personToDelete.fullName
        ? this.personToDelete.fullName
        : "";
    return `Are you sure you want to delete this person - ${name}?`;
  }

  setUpView = async (token: string | null, logged: boolean) => {
    if (logged && token) {
      this.messageSetter("Getting the people, please be patient");
      await this.getPeopleAction(token);
      this.messageSetter("People CRUD");
    } else {
      this.messageSetter("You are not logged in!");
    }
  }
  askToDelete(person: Person): void {
    this.personToDelete = person;
    this.showDeletePopup = true;
  }
  closeModal(): void {
    this.showDeletePopup = false;
  }
  async deletePerson(): Promise<void> {
    let token = this.$cookies.get("token") as string | null;
    if (!token) token = await this.setNewToken();
    this.closeModal();
    if (token && this.personToDelete) {
      await this.deletePersonAction({ person: this.personToDelete, token });
    }
  }
}
</script>
