<template>
  <v-card flat v-if="logged">
    <v-card-title class="h2 justify-center" primary-title>{{
      message
    }}</v-card-title>
    <v-card-text>
      <v-form ref="form" class="px-4" v-model="formWithoutErrors">
        <v-container>
          <v-text-field
            v-model="person.firstName"
            :rules="[rules.counter, rules.required]"
            label="First Name"
            prepend-icon="mdi-account"
            color="black"
          >
          </v-text-field>
          <v-text-field
            v-model="person.lastName"
            :rules="[rules.counter, rules.required]"
            label="Last Name"
            prepend-icon="mdi-account"
            color="black"
          ></v-text-field>

          <v-text-field
            v-model="person.email"
            :rules="[rules.email, rules.required]"
            label="E-mail"
            prepend-icon="mdi-email"
            color="black"
          ></v-text-field>

          <v-text-field
            v-model="person.phone"
            :rules="[rules.phone, rules.required]"
            label="Phone"
            prepend-icon="mdi-phone"
            color="black"
          ></v-text-field>

          <v-menu
            v-model="calendarMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                :rules="[rules.required]"
                v-model="dateFormatted"
                label="Birth Date"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              year-icon="mdi-calendar-blank"
              :width="$vuetify.breakpoint.xs ? '240px' : '320px'"
              v-model="person.birthDate"
              scrollable
              color="black"
              @input="calendarMenu = false"
            ></v-date-picker>
          </v-menu>

          <v-btn depressed class="mx-0 mt-3" @click="submit()">{{
            buttonText
          }}</v-btn>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";
import { cloneDeep } from "lodash";
import { mixins } from "vue-class-component";
import Person from "@/shared/person";
import mixinForViews from "../shared/mixinForViews";
import parsePhoneNumber from "libphonenumber-js/max";

@Component({
  name: "PersonDetail",
  computed: {
    ...mapGetters(["getPersonById"]),
  },
  methods: {
    ...mapActions(["addPersonAction", "updatePersonAction"]),
  },
})
export default class PersonDetail extends mixins(mixinForViews) {
  addPersonAction!: ({
    person,
    token,
  }: {
    person: Person;
    token: string;
  }) => Promise<void>;
  updatePersonAction!: ({
    person,
    token,
  }: {
    person: Person;
    token: string;
  }) => Promise<void>;
  getPersonById!: (id: string) => Person | undefined;

  @Prop({ default: "" }) id!: string;
  buttonText: string = "";
  calendarMenu: boolean = false;
  formWithoutErrors: boolean = false;
  rules = {
    counter: (value: string) => value.length >= 5 || "Min 5 characters",
    required: (value: string) => !!value || "Required.",
    email: (value: string) => {
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value) || "Invalid e-mail.";
    },
    phone: (value: string) => {
      const phoneNumber = parsePhoneNumber(value, "PL");
      if (phoneNumber) {
        return phoneNumber.isValid() || "Invalid phone number";
      } else {
        return "Invalid phone number";
      }
    },
  };
  person: Person = {
    id: undefined,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
  };
  get dateFormatted(): string {
    return this.formatDate(this.person.birthDate);
  }
  get isAddMode(): boolean {
    return this.id === "new";
  }
  setUpView = async (token: string | null, logged: boolean) => {
    if (logged && token) {
      if (this.isAddMode) {
        this.setUpForAddingMode();
      } else {
        await this.setUpForEditingMode(token);
      }
    } else {
      this.$router.push({ name: "CrudView" });
    }
  };
  async setUpForEditingMode(token: string): Promise<void> {
    if (this.people.length == 0) await this.getPeopleAction(token);
    const personFromState: Person | undefined = this.getPersonById(this.id);
    if (personFromState) {
      this.message = "Edit this person";
      this.buttonText = "Edit person";
      this.person = cloneDeep(personFromState);
    } else {
      this.$router.push({ name: "CrudView" });
    }
  }
  setUpForAddingMode(): void {
    this.message = "Add a new person";
    this.buttonText = "Add person";
  }
  async submit(): Promise<void> {
    let token = this.$cookies.get("token") as string | null;
    if (!token) token = await this.setNewToken();
    this.checkForm();
    if (this.formWithoutErrors && token) {
      this.isAddMode
        ? await this.addPersonAction({ person: this.person, token })
        : await this.updatePersonAction({ person: this.person, token });
      this.$router.push({ name: "CrudView" });
    }
  }
  checkForm(): void {
    (this.$refs.form as Vue & { validate: () => boolean }).validate();
  }
}
</script>