import { IMatch, RequestBuilder } from "../typings";
import { Client } from "./Client";
import { Errors } from "./Errors";

export class Matches {
    private client: Client;
    private subdomain: string;
    constructor(options: RequestBuilder, client: Client) {
        this.subdomain = options.subDomain as string;
        this.client = client;
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @param {string} state - `all` (default), `pending`, `open`, `complete` (is a tournament state)
     * @param {string} participant_id - The participant's unique ID (Only retrieve matches that include the specified participant)
     * @description Retrieve a tournament's match list.
     * @returns {Promise<IMatch[]} - A promise that resolves with the `Matches` object
     */
    public async index(
        tournament_id: string,
        state: "all" | "pending" | "open" | "complete" = "all",
        participant_id?: string
    ): Promise<IMatch[] | undefined> {
        const response = await this.client
            .request(`/${this.subdomain}${tournament_id}/matches`, {
                method: "GET",
                state,
                participant_id
            })
            .then((res: { match: IMatch }[]) => res.map(({ match }) => match));

        if (response.length < 1) {
            throw new Error(Errors.MATCH_NO_MATCHES_FOUND.replace(/{state}/, state));
        }
        return response;
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @param {string} match_id - The match's unique ID
     * @description Retrieve a single match record for a tournament.
     * @returns {Promise<IMatch>} - A promise that resolves with the `Matches` object
     */
    public async show(tournament_id: string, match_id: string): Promise<IMatch> {
        return this.client
            .request(`/${this.subdomain}${tournament_id}/matches/${match_id}`, { method: "GET" })
            .then(({ match }: { match: IMatch }) => match);
    }

    /**
     *
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @param {string} match_id - The match's unique ID
     * @param {string|undefined} props.match.scoresCsv - Comma separated set/game scores with player 1 score first (e.g. "1-3,3-0,3-2")
     * @param {string|undefined} props.match.winnerId - The participant ID of the winner or "tie" if applicable (Round Robin and Swiss). NOTE: If you change the outcome of a completed match, all matches in the bracket that branch from the updated match will be reset.
     * @param {string|undefined} props.match.player1Votes - Overwrites the number of votes for player 1
     * @param {string|undefined} props.match.player2Votes - Overwrites the number of votes for player 2
     * @description Update/submit the score(s) for a match. If you're updating winner_id, scores_csv must also be provided. You may, however, update score_csv without providing winner_id for live score updates.
     * @returns {Promise<IMatch>} - A promise that resolves with the `Matches` object
     */
    public async update(
        tournament_id: string,
        match_id: string,
        props: { match: { scoresCsv?: string; winnerId?: string; player1Votes?: number; player2Votes?: number } }
    ): Promise<IMatch> {
        return this.client
            .request(`/${this.subdomain}${tournament_id}/matches/${match_id}`, { method: "PUT", match: props.match })
            .then(({ match }: { match: IMatch }) => match);
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @param {string} match_id - The match's unique ID
     * @description Reopens a match that was marked completed, automatically resetting matches that follow it
     * @returns {Promise<IMatch>} - A promise that resolves with the `Matches` object
     */
    public async reOpen(tournament_id: string, match_id: string): Promise<IMatch> {
        return this.client
            .request(`/${this.subdomain}${tournament_id}/matches/${match_id}/reopen`, { method: "POST" })
            .then(({ match }: { match: IMatch }) => match);
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @param {string} match_id - The match's unique ID
     * @description Sets "underway_at" to the current time and highlights the match in the bracket
     * @returns {Promise<IMatch>} - A promise that resolves with the `Matches` object
     */
    public async markUnderwayAt(tournament_id: string, match_id: string): Promise<IMatch> {
        return this.client
            .request(`/${this.subdomain}${tournament_id}/matches/${match_id}/mark_as_underway`, { method: "POST" })
            .then(({ match }: { match: IMatch }) => match);
    }

    /**
     * @async
     * @param {string} tournament_id - The ID of the tournament to process the action.
     * @param {string} match_id - The match's unique ID
     * @description Clears "underway_at" and unhighlights the match in the bracket
     * @returns {Promise<IMatch>} - A promise that resolves with the `Matches` object
     */
    public async unmarkUnderwayAt(tournament_id: string, match_id: string): Promise<IMatch> {
        return this.client
            .request(`/${this.subdomain}${tournament_id}/matches/${match_id}/unmark_as_underway`, { method: "POST" })
            .then(({ match }: { match: IMatch }) => match);
    }
}
