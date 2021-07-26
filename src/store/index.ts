import { skipParam, takeParam } from '@/shared/constants';
import Vue from 'vue'
import Vuex, { Commit } from 'vuex'
import { dataService } from '../shared/data.service';
import Person from '../shared/person';

Vue.use(Vuex)

interface stateInterface {
  logged: boolean,
  people: Array<Person>,
}

const state: stateInterface = {
  logged: false,
  people: [],
};

const mutations = {
  setLogged: (state: stateInterface, logged: boolean) => { state.logged = logged },
  removePeople: (state: stateInterface) => { state.people = [] },
  getPeople: (state: stateInterface, people: Array<Person>) => { state.people = people },
  deletePerson: (state: stateInterface, personId: string) => { state.people = [...state.people.filter((p: Person): boolean => p.id !== personId)] },
  addPerson: (state: stateInterface, person: Person) => { state.people.push(person) },
  updatePerson: (state: stateInterface, person: Person) => {
    const index = state.people.findIndex((p: Person): boolean => p.id === person.id);
    state.people.splice(index, 1, person);
    state.people = [...state.people];
  },
};

const actions = {
  setLoggedAction: ({ commit }: { commit: Commit }, logged: boolean) => commit('setLogged', logged),
  removePeopleAction: ({ commit }: { commit: Commit }) => commit('removePeople'),
  async getPeopleAction({ commit }: { commit: Commit }, token: string) {
    const people = await dataService.getPeople(skipParam, takeParam, token);
    people.sort((a: Person, b: Person): number => (a.firstName > b.firstName) ? 1 : -1);
    commit('getPeople', people);
  },
  async deletePersonAction({ commit }: { commit: Commit }, { person, token }: { person: Person, token: string }) {
    const deletedPersonId = await dataService.deletePerson(person, token);
    if (deletedPersonId) commit('deletePerson', deletedPersonId);
  },
  async addPersonAction({ commit }: { commit: Commit }, { person, token }: { person: Person, token: string }) {
    const addedPerson = await dataService.addPerson(person, token);
    if (addedPerson) commit('addPerson', addedPerson);
  },
  async updatePersonAction({ commit }: { commit: Commit }, { person, token }: { person: Person, token: string }) {
    const updatedPerson = await dataService.updatePerson(person, token);
    if(updatedPerson) commit('updatePerson', updatedPerson);
  } 
};

const getters = {
  getPersonById: (state: stateInterface) => (id: string) => state.people.find(p => p.id === id),
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
})
