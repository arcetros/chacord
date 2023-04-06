import { IParticipant, RequestBuilder } from "../typings";
import { Client } from "./Client";

export class Participant {
    private subdomain: string;
    private client: Client;
    constructor(options: RequestBuilder, client: Client) {
        this.subdomain = options.subDomain as string;
        this.client = client;
    }
    async index(tournament_id: string): Promise<IParticipant> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants`, { method: "GET" });
    }

    async create(
        tournament_id: string,
        props: {
            participant: { name: string; challongeUsername?: string; email?: string; seed?: number; misc?: string };
        }
    ): Promise<IParticipant> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants`, {
            method: "POST",
            participant: props.participant
        });
    }

    async bulkAdd(
        tournament_id: string,
        props: {
            participants: { name: string; challongeUsername?: string; email?: string; seed?: number; misc?: string }[];
        }
    ): Promise<IParticipant[]> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants/bulk_add`, {
            method: "POST",
            participants: props.participants
        });
    }

    async show(tournament_id: string, participant_id: string): Promise<IParticipant> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants/${participant_id}`, {
            method: "GET"
        });
    }

    async update(
        tournament_id: string,
        participant_id: string,
        props: {
            participant: { name: string; challongeUsername?: string; email?: string; seed?: number; misc?: string };
        }
    ): Promise<IParticipant> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants/${participant_id}`, {
            method: "PUT",
            participant: props.participant
        });
    }

    async checkIn(tournament_id: string, participant_id: string): Promise<IParticipant> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants/${participant_id}/check_in`, {
            method: "POST"
        });
    }

    async undoCheckIn(tournament_id: string, participant_id: string): Promise<IParticipant> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants/${participant_id}/undo_check_in`, {
            method: "POST"
        });
    }

    async destroy(tournament_id: string, participant_id: string): Promise<IParticipant> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants/${participant_id}`, {
            method: "DELETE"
        });
    }

    async clear(tournament_id: string): Promise<{ message: string }> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants/clear`, { method: "DELETE" });
    }

    async randomize(tournament_id: string): Promise<IParticipant[]> {
        return this.client.request(`/${this.subdomain}${tournament_id}/participants/randomize`, { method: "POST" });
    }
}
