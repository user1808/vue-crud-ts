import { Component, Vue, Watch } from "vue-property-decorator";
import { dataService } from "./data.service";
import { mapActions, mapState } from "vuex";
import Person from "./person";

@Component({
    computed: {
        ...mapState(["logged", "people"]),
    },
    methods: {
        ...mapActions(["setLoggedAction", "getPeopleAction"]),
    }
})
export default class mixinForViews extends Vue {
    setUpView!: (token: string | null, logged: boolean) => Promise<void>;
    setLoggedAction!: (logged: boolean) => void;
    getPeopleAction!: (token: string) => Promise<void>;
    logged!: boolean;
    people!: Array<Person>;

    message: string = "";
    unwatchLogged: boolean = false;

    async setNewToken(): Promise<string | null> {
        const username = this.$cookies.get("username");
        const password = this.$cookies.get("password");
        if (username && password && typeof username !== 'object' && typeof password !== 'object') {
            const token: string | null = await dataService.getToken(username, password);
            if(token) this.$cookies.set("token", token, { expires: "300s" });
            return token;
        } else {
            return null;
        }
    }
    formatDate(date: string | undefined): string {
        if (!date) return '';
        const [year, month, day] = date.split("-");
        return `${day}.${month}.${year}`;
    }
    formatPhoneNumber(phoneNumber: string | undefined): string {
        if (!phoneNumber) return '';
        return phoneNumber.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
    }
    messageSetter(message: string): void {
        this.message = message;
    }
    @Watch('logged')
    async onLoggedChange(newValue: boolean, oldValue: boolean): Promise<void> {
        if (!this.unwatchLogged) {
            if (newValue && !oldValue) {
                const token = this.$cookies.get("token") as string;
                await this.setUpView(token, this.logged);
            }
            if (!newValue && oldValue) {
                if (this.$options.name === 'PersonDetail') {
                    this.$router.push({ name: "CrudView" });
                } else {
                    this.messageSetter("You are not logged in!");
                }
            }
        }
    }
    async created(): Promise<void> {
        this.unwatchLogged = true;
        let token = this.$cookies.get("token") as string | null;
        if (!token) {
            token = await this.setNewToken();
        }
        this.setLoggedAction(token ? true : false);
        await this.setUpView(token, this.logged);
        this.unwatchLogged = false;
    }
}
