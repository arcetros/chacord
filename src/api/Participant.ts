import { IParticipant, RequestBuilder } from "../typings";
import { Client } from "./Client";

export class Participant {
    private subdomain: string;
    private client: Client;
    constructor(options: RequestBuilder, client: Client) {
        this.subdomain = options.subDomain as string;
        this.client = client;
    }

    /**
     * @async
     * @description Retrieve a tournament's participant list.
     * @returns {Promise<IParticipant>} - A promise that resolves with the `Participant` object
     * See the {@link https://api.challonge.com/v1/documents/tournaments/index} for a full list of object properties
     */
    public async index(tournament_id: string): Promise<IParticipant[]> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants`, { method: "GET" });
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @param {string} props.participant.name - The name displayed in the bracket/schedule - not required if email or challonge_username is provided. Must be unique per tournament.
     * @param {string} props.participant.challongeUsername - Provide this if the participant has a Challonge account. He or she will be invited to the tournament.
     * @param {string} props.participant.inviteNameOrEmail - Providing this will first search for a matching Challonge account. If one is found, this will have the same effect as the "challonge_username" attribute. If one is not found, the "new-user-email" attribute will be set, and the user will be invited via email to create an account.
     * @param {string} props.participant.seed - The participant's new seed. Must be between 1 and the current number of participants (including the new record). Overwriting an existing seed will automatically bump other participants as you would expect.
     * @param {string} props.participant.misc - Multi-purpose field that is only visible via the API and handy for site integration (e.g. key to your users table)
     * @description Add a participant to a tournament (up until it is started).
     * @returns {Promise<IParticipant>} - A promise that resolves with the `Participant` object
     * See the {@link https://api.challonge.com/v1/documents/participants/create} for a full list of object properties
     */
    public async create(
        tournament_id: string,
        props: {
            participant: {
                name: string;
                challongeUsername?: string;
                inviteNameOrEmail?: string;
                seed?: number;
                misc?: string;
            };
        }
    ): Promise<IParticipant> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants`, {
            method: "POST",
            participant: props.participant
        });
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @param {string} props.participant.name - The name displayed in the bracket/schedule - not required if email or challonge_username is provided. Must be unique per tournament.
     * @param {string} props.participant.challongeUsername - Provide this if the participant has a Challonge account. He or she will be invited to the tournament.
     * @param {string} props.participant.inviteNameOrEmail - Providing this will first search for a matching Challonge account. If one is found, this will have the same effect as the "challonge_username" attribute. If one is not found, the "new-user-email" attribute will be set, and the user will be invited via email to create an account.
     * @param {string} props.participant.seed - The participant's new seed. Must be between 1 and the current number of participants (including the new record). Overwriting an existing seed will automatically bump other participants as you would expect.
     * @param {string} props.participant.misc - Multi-purpose field that is only visible via the API and handy for site integration (e.g. key to your users table)
     * @description Bulk add participants to a tournament (up until it is started). If an invalid participant is detected, bulk participant creation will halt and any previously added participants (from this API request) will be rolled back.
     * @returns {Promise<IParticipant>} - A promise that resolves with the `Participant` object
     * See the {@link https://api.challonge.com/v1/documents/participants/bulk_add} for a full list of object properties
     */
    public async bulkAdd(
        tournament_id: string,
        props: {
            participants: {
                name: string;
                challongeUsername?: string;
                inviteNameOrEmail?: string;
                seed?: number;
                misc?: string;
            }[];
        }
    ): Promise<IParticipant[]> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants/bulk_add`, {
            method: "POST",
            participants: props.participants
        });
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @param {string} participant_id - The participant's unique ID.
     * @param {number} includeMatches - 0 or 1; includes an array of associated match records
     * @description Retrieve a single participant record for a tournament.
     * @returns {Promise<IParticipant>} - A promise that resolves with the `Participant` object
     * See the {@link https://api.challonge.com/v1/documents/participants/show} for a full list of object properties
     */
    public async show(tournament_id: string, participant_id: string, includeMatches?: number): Promise<IParticipant> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants/${participant_id}`, {
            method: "GET",
            includeMatches
        });
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @param {string} participant_id - The participant's unique ID.
     * @param {string} props.participant.name - The name displayed in the bracket/schedule - not required if email or challonge_username is provided. Must be unique per tournament.
     * @param {string} props.participant.inviteNameOrEmail - Provide this if the participant has a Challonge account. He or she will be invited to the tournament.
     * @param {string} props.participant.email - Providing this will first search for a matching Challonge account. If one is found, this will have the same effect as the "challonge_username" attribute. If one is not found, the "new-user-email" attribute will be set, and the user will be invited via email to create an account.
     * @param {string} props.participant.seed - The participant's new seed. Must be between 1 and the current number of participants (including the new record). Overwriting an existing seed will automatically bump other participants as you would expect.
     * @param {string} props.participant.misc - Multi-purpose field that is only visible via the API and handy for site integration (e.g. key to your users table)
     * @description Update the attributes of a tournament participant.
     * @returns {Promise<IParticipant>} - A promise that resolves with the `Participant` object
     * See the {@link https://api.challonge.com/v1/documents/participants/update} for a full list of object properties
     */
    public async update(
        tournament_id: string,
        participant_id: string,
        props: {
            participant: { name: string; inviteNameOrEmail?: string; email?: string; seed?: number; misc?: string };
        }
    ): Promise<IParticipant> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants/${participant_id}`, {
            method: "PUT",
            participant: props.participant
        });
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @param {string} participant_id - The participant's unique ID.
     * @description Checks a participant in, setting checked_in_at to the current time.
     * @returns {Promise<IParticipant>} - A promise that resolves with the `Participant` object
     * See the {@link https://api.challonge.com/v1/documents/participants/check_in} for a full list of object properties
     */
    public async checkIn(tournament_id: string, participant_id: string): Promise<IParticipant> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants/${participant_id}/check_in`, {
            method: "POST"
        });
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @param {string} participant_id - The participant's unique ID.
     * @description Marks a participant as having not checked in, setting checked_in_at to nil.
     * @returns {Promise<IParticipant>} - A promise that resolves with the `Participant` object
     * See the {@link https://api.challonge.com/v1/documents/participants/undo_check_in} for a full list of object properties
     */
    public async undoCheckIn(tournament_id: string, participant_id: string): Promise<IParticipant> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants/${participant_id}/undo_check_in`, {
            method: "POST"
        });
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @param {string} participant_id - The participant's unique ID.
     * @description If the tournament has not started, delete a participant, automatically filling in the abandoned seed number. If tournament is underway, mark a participant inactive, automatically forfeiting his/her remaining matches.
     * @returns {Promise<IParticipant>} - A promise that resolves with the `Participant` object
     * See the {@link https://api.challonge.com/v1/documents/participants/destroy} for a full list of object properties
     */
    public async destroy(tournament_id: string, participant_id: string): Promise<IParticipant> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants/${participant_id}`, {
            method: "DELETE"
        });
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @description Deletes all participants in a tournament. (Only allowed if tournament hasn't started yet)
     * @returns {Promise<string>} - A promise that return a message whether is success or not
     * See the {@link https://api.challonge.com/v1/documents/participants/clear} for a full list of object properties
     */
    public async clear(tournament_id: string): Promise<string> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants/clear`, { method: "DELETE" });
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @description Randomize seeds among participants. Only applicable before a tournament has started.
     * @returns {Promise<IParticipant>} - A promise that resolves with the `Participant` object
     * See the {@link https://api.challonge.com/v1/documents/participants/randomize} for a full list of object properties
     */
    public async randomize(tournament_id: string): Promise<IParticipant[]> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants/randomize`, { method: "POST" });
    }
}
