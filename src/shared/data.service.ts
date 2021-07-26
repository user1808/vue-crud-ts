import axios, { AxiosResponse } from 'axios';

import { API } from './config';
import Person from './person';

const getToken = async function (username: string, password: string) {
    try {
        const response = await axios({
            method: 'post',
            url: `${API}/token`,
            data: {
                username: `${username}`,
                password: `${password}`,
            },
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*',
            },
        });
        if (response.status !== 200) throw Error(response.statusText);
        let responseToken: string | null = null;
        if (response.data.access_token && typeof response.data.access_token === 'string') {
            responseToken = response.data.access_token;
        }
        return responseToken;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const invalidateToken = async function (token: string) {
    try {
        const response = await axios({
            method: 'post',
            url: `${API}/logout`,
            headers: {
                'accept': '*/*',
                'Authorization': `${token}`,
            },
        });
        if (response.status !== 204) throw Error(response.statusText);
        return true;
    } catch (error) {
        console.error(error, token);
        return false;
    }
}

const getPeople = async function (skipParam: number, takeParam: number, token: string) {
    try {
        const response = await axios({
            method: 'get',
            url: `${API}/api/users`,
            params: {
                skip: skipParam,
                take: takeParam,
            },
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data: Array<Person> = parseList(response);

        const people: Array<Person> = data.map(function (p: Person) {
            p.birthDate = p.birthDate.split('T')[0];
            p.fullName = `${p.firstName} ${p.lastName}`;
            p.initials = p.firstName.charAt(0) + p.lastName.charAt(0);
            return p;
        });
        return people;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const getPerson = async function (id: string, token: string) {
    try {
        const response = await axios({
            method: 'get',
            url: `${API}/api/users/${id}`,
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        const person: Person | null = parseItem(response, 200);
        return person;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const addPerson = async function (person: Person, token: string) {
    try {
        const response = await axios({
            method: 'post',
            url: `${API}/api/users`,
            data: person,
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        if (response.status !== 201) throw Error(response.statusText);
        const addedPerson = response.data as Person;
        return addedPerson;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const deletePerson = async function (person: Person, token: string) {
    try {
        const response = await axios({
            method: 'delete',
            url: `${API}/api/users/${person.id}`,
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.status !== 204) throw Error(response.statusText);
        return person.id as string;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const updatePerson = async function (person: Person, token: string) {
    try {
        const response = await axios({
            method: 'put',
            url: `${API}/api/users/${person.id}`,
            data: person,
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const updatedPerson: Person | null = parseItem(response, 204);
        return updatedPerson;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const parseList = (response: AxiosResponse<any>) => {
    if (response.status !== 200) throw Error(response.statusText);
    let list: Array<Person> = [];
    if (response.data && typeof response.data === 'object'){
        list = response.data as Array<Person>;
    }
    return list;
};

const parseItem = function (response: AxiosResponse<any>, code: number) {
    if (response.status !== code) throw Error(response.statusText);
    let item: Person | null  = null;
    if (response.data && typeof response.data === 'object') {
        item = response.data;
    }
    return item;
};

export const dataService = {
    getToken,
    invalidateToken,
    getPeople,
    getPerson,
    deletePerson,
    addPerson,
    updatePerson,
};
