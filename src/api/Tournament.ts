import { ITournament, RequestBuilder } from "../typings";
import Client from "./Client";

export class Tournament {
    private subdomain: string;
    private client: Client;
    constructor(options: RequestBuilder, client: Client) {
        this.subdomain = options.subDomain as string;
        this.client = client;
    }

    private getRawSubdomain() {
        if (this.subdomain[this.subdomain.length - 1] === "-") {
            return this.subdomain.substring(0, this.subdomain.length - 1);
        }
        return this.subdomain;
    }

    /**
     * @async
     * @description Retrieve a set of tournaments created with your account
     * @returns {Promise<ITournament>} - A promise that resolves with the tournament object
     * See the {@link https://api.challonge.com/v1/documents/tournaments/index} for a full list of object properties
     */
    public async index(): Promise<ITournament[]> {
        if (this.getRawSubdomain()) {
            this.subdomain = this.getRawSubdomain();
        }
        return this.client.request("", { method: "GET" });
        // .then((res: { tournament: ITournament }[]) => res.map(({ tournament }) => tournament));
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @param {boolean} includeParticipants - false or true; includes an array of associated participant records
     * @param {boolean} includeMatches - false or true; includes an array of associated match records
     * @description Retrieve a single tournament record
     * @returns {Promise<ITournament>} - A promise that resolves with the tournament object
     * See the {@link https://api.challonge.com/v1/documents/tournaments/show} for a full list of object properties
     */
    public async show(
        tournament_id: string,
        includeParticipants = false,
        includeMatches = false
    ): Promise<ITournament> {
        const response = await this.client.request(`/${this.subdomain}${tournament_id}`, {
            method: "GET",
            includeParticipants: includeParticipants ? "1" : "0",
            includeMatches: includeMatches ? "1" : "0"
        });
        const newResponse: ITournament = {
            ...response,
            matches: this.client.extractResponse(response?.matches),
            participants: this.client.extractResponse(response?.participants)
        };
        return newResponse;
    }

    /**
     * @description Create a new tournament with the specified name, URL, tournament type, and subdomain (if applicable)
     * @async
     * @param {string} props.tournament.name - The name of the tournament.
     * @param {string=} props.tournament.url - The optional URL for the tournament.
     * @param {string} props.tournament.tournamentType - The type of the tournament.
     * @param {string=} props.tournament.subDomain - The optional subdomain for the tournament.
     * @returns {Promise<ITournament>} - A promise that resolves with the tournament object
     * See the {@link https://api.challonge.com/v1/documents/tournaments/create} for a full list of object properties
     */
    public async create(props: {
        tournament: { name: string; url?: string; tournamentType: string; subDomain?: string };
    }): Promise<ITournament> {
        if (this.getRawSubdomain()) {
            props.tournament.subDomain = this.getRawSubdomain();
        }
        return this.client.request("", { method: "POST", tournament: props.tournament });
    }

    /**
     * @description Update a tournament properties registered on your account
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @param {string} props.tournament.name - The name of the tournament.
     * @param {string=} props.tournament.url - The optional URL for the tournament.
     * @param {string} props.tournament.tournamentType - The type of the tournament.
     * @param {string=} props.tournament.subDomain - The optional subdomain for the tournament.
     * @returns {Promise<ITournament>} - A promise that resolves with the tournament object
     * See the {@link https://api.challonge.com/v1/documents/tournaments/update} for a full list of object properties
     */
    public async update(
        tournament_id: string,
        props: {
            tournament: { name?: string; url?: string; tournamentType?: string; subDomain?: string };
        }
    ): Promise<ITournament> {
        return this.client.request(`/${this.subdomain}${tournament_id}`, {
            method: "PUT",
            tournament: props.tournament
        });
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @description Delete a tournament registered on your account
     * @returns {Promise<ITournament>} - A promise that resolves with the tournament object
     * See the {@link https://api.challonge.com/v1/documents/tournaments/destroy} for a full list of object properties
     */
    public async destroy(tournament_id: string): Promise<ITournament> {
        return this.client.request(`/${this.subdomain}${tournament_id}`, { method: "DELETE" });
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @description Start a tournament registered on your account
     * @returns {Promise<ITournament>} - A promise that resolves with the tournament object
     * See the {@link https://api.challonge.com/v1/documents/tournaments/start} for a full list of object properties
     */
    public async start(tournament_id: string): Promise<ITournament> {
        return this.client.request(`/${this.subdomain}${tournament_id}/start`, { method: "POST" });
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @description Finalize a tournament that has had all match scores submitted
     * @returns {Promise<ITournament>} - A promise that resolves with the tournament object
     * See the {@link https://api.challonge.com/v1/documents/tournaments/finalize} for a full list of object properties
     */
    public async finalize(tournament_id: string): Promise<ITournament> {
        return this.client.request(`/${this.subdomain}${tournament_id}/finalize`, { method: "POST" });
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @description Reset a tournament, clearing all scores and attachments. You can then add/remove/edit participants
     * @returns {Promise<ITournament>} - A promise that resolves with the tournament object
     * See the {@link https://api.challonge.com/v1/documents/tournaments/reset} for a full list of object properties
     */
    public async reset(tournament_id: string): Promise<ITournament> {
        return this.client.request(`/${this.subdomain}${tournament_id}/reset`, { method: "POST" });
    }

    /**
     * Transitions a tournament from 'checking_in' to 'checked_in' after the check-in window has closed.
     * Inactive participants who have not checked in are moved to the bottom seeds.
     * Checked-in participants on the waiting list will be promoted if slots become available.
     *
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @description This should be invoked after a tournament's check-in window closes before the tournament is started.
     * @returns {Promise<ITournament>} - A promise that resolves with the tournament object
     * See the {@link https://api.challonge.com/v1/documents/tournaments/process_check_ins} for a full list of object properties
     */
    public async processCheckIns(tournament_id: string): Promise<ITournament> {
        return this.client.request(`/${this.subdomain}${tournament_id}/process_check_ins`, { method: "POST" });
    }

    /**
     * - Transitions the tournament state from 'checking_in' or 'checked_in' to 'pending'
     *
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @description When your tournament is in a 'checking_in' or 'checked_in' state, there's no way to edit the tournament's start time (start_at) or check-in duration (check_in_duration). You must first abort check-in, then you may edit those attributes
     * @returns {Promise<ITournament>} - A promise that resolves with the tournament object
     * See the {@link https://api.challonge.com/v1/documents/tournaments/abort_check_in} for a full list of object properties
     */
    public async abortCheckIn(tournament_id: string): Promise<ITournament> {
        return this.client.request(`/${this.subdomain}${tournament_id}/abort_check_in`, { method: "POST" });
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @param {boolean} includeParticipants - false or true; includes an array of associated participant records
     * @param {boolean} includeMatches - false or true; includes an array of associated match records
     * @description Sets the state of the tournament to start accepting predictions. Your tournament's 'prediction_method' attribute must be set to 1 (exponential scoring) or 2 (linear scoring) to use this option.
     * @returns {Promise<ITournament>} - A promise that resolves with the tournament object
     * See the {@link https://api.challonge.com/v1/documents/tournaments/open_for_predictions} for a full list of object properties
     */
    public async openForPredictions(
        tournament_id: string,
        includeParticipants = false,
        includeMatches = false
    ): Promise<ITournament> {
        const response: ITournament = await this.client.request(
            `/${this.subdomain}${tournament_id}/open_for_predictions`,
            {
                method: "POST",
                includeParticipants: includeParticipants ? "1" : "0",
                includeMatches: includeMatches ? "1" : "0"
            }
        );
        const newResponse: ITournament = {
            ...response,
            matches: this.client.extractResponse(response?.matches),
            participants: this.client.extractResponse(response?.participants)
        };
        return newResponse;
    }
}
