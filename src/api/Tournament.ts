import { ITournament, RequestBuilder } from "../typings";
import { Client } from "./Client";

export class Tournament {
    private subdomain: string;
    private client: Client;
    private options: RequestBuilder;
    constructor(options: RequestBuilder, client: Client) {
        this.subdomain = options.subDomain as string;
        this.options = options;
        this.client = client;
    }

    private getRawSubdomain() {
        if (this.subdomain[this.subdomain.length - 1] === "-") {
            return this.subdomain.substring(0, this.subdomain.length - 1);
        }
        return this.subdomain;
    }

    // Retrieve a set of tournaments created with your account
    // https://api.challonge.com/v1/documents/tournaments/index
    public async index(): Promise<ITournament[]> {
        if (this.getRawSubdomain()) {
            this.subdomain = this.getRawSubdomain();
        }
        return this.client.request("", { method: "GET" }).then(res => res.map((t: any) => t.tournament));
    }

    // Retrieve a single tournament record
    // https://api.challonge.com/v1/documents/tournaments/show
    public async show(id: string): Promise<ITournament> {
        return this.client.request(`/${this.options.subDomain}${id}`, { method: "GET" }).then(res => res.tournament);
    }

    // Create a new tournament
    // https://api.challonge.com/v1/documents/tournaments/create
    public async create(props: {
        tournament: { name: string; url?: string; tournamentType: string; subDomain?: string };
    }): Promise<ITournament> {
        if (this.getRawSubdomain()) {
            props.tournament.subDomain = this.getRawSubdomain();
        }
        return this.client.request("", { method: "POST", tournament: props.tournament });
    }

    // Update a tournament registered on your account
    // https://api.challonge.com/v1/documents/tournaments/update
    public async update(
        id: string,
        props: {
            tournament: { name?: string; url?: string; tournamentType?: string; subDomain?: string };
        }
    ) {
        return this.client.request(`/${this.options.subDomain}${id}`, { method: "PUT", tournament: props.tournament });
    }

    // Delete a tournament registerd on your account
    // https://api.challonge.com/v1/documents/tournaments/destroy
    public async destroy(id: string): Promise<ITournament> {
        return this.client.request(`/${this.options.subDomain}${id}`, { method: "DELETE" });
    }

    // Start a tournament registerd on your account
    // https://api.challonge.com/v1/documents/tournaments/start
    public async start(id: string): Promise<ITournament> {
        return this.client.request(`/${this.options.subDomain}${id}/start`, { method: "POST" });
    }

    // Finalize a tournament that has had all match scores submitted
    // https://api.challonge.com/v1/documents/tournaments/finalize
    public async finalize(id: string): Promise<ITournament> {
        return this.client.request(`/${this.options.subDomain}${id}/finalize`, { method: "POST" });
    }

    // Reset a tournament, clearing all scores and attachments. You can then add/remove/edit participants
    // https://api.challonge.com/v1/documents/tournaments/reset
    public async reset(id: string): Promise<ITournament> {
        return this.client.request(`/${this.options.subDomain}${id}/reset`, { method: "POST" });
    }

    // This should be invoked after a tournament's check-in window closes before the tournament is started.
    // - Marks participants who have not checked in as inactive.
    // - Moves inactive participants to bottom seeds (ordered by original seed).
    // - Transitions the tournament state from 'checking_in' to 'checked_in'
    // NOTE: Checked in participants on the waiting list will be promoted if slots become available.
    // https://api.challonge.com/v1/documents/tournaments/process_check_ins
    public async processCheckIns(id: string): Promise<ITournament> {
        return this.client.request(`/${this.options.subDomain}${id}/process_check_ins`, { method: "POST" });
    }

    // When your tournament is in a 'checking_in' or 'checked_in' state, there's no way to edit the tournament's start time (start_at) or check-in duration (check_in_duration). You must first abort check-in, then you may edit those attributes
    // - Makes all participants active and clears their checked_in_at times.
    // - Transitions the tournament state from 'checking_in' or 'checked_in' to 'pending'
    // https://api.challonge.com/v1/documents/tournaments/abort_check_in
    public async abortCheckIn(id: string): Promise<ITournament> {
        return this.client.request(`/${this.options.subDomain}${id}/abort_check_in`, { method: "POST" });
    }

    // Sets the state of the tournament to start accepting predictions. Your tournament's 'prediction_method' attribute must be set to 1 (exponential scoring) or 2 (linear scoring) to use this option.
    // Note: Note: Once open for predictions, match records will be persisted, so participant additions and removals will no longer be permitted.
    // https://api.challonge.com/v1/documents/tournaments/open_for_predictions
    public async openForPredictions(id: string, includeParticipants: number, includeMatches: number) {
        return this.client.request(`/${this.options.subDomain}${id}/open_for_predictions`, {
            method: "POST",
            includeParticipants,
            includeMatches
        });
    }
}
