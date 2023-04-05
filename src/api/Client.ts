import { EventEmitter } from "events";

import { Errors } from "./Errors";
import { serialize, keysToObject, camelToUnderscore } from "../utils";
import { RequestBuilder, Tournament } from "../typings";

const BASE_URL = "https://api.challonge.com/v1";

export class Client extends EventEmitter {
    private options: RequestBuilder;
    constructor(options: RequestBuilder) {
        super();
        this.options = options || {};

        if (typeof options != "object") {
            throw new Error("You have to specify options in client constructor");
        }
        if (typeof this.options.messageProperties === undefined) {
            this.options.messageProperties = true;
        }
        if (!options.hasOwnProperty.call(options, "api_key")) {
            throw new Error("You have to specify Challonge API key");
        }
        if (!this.options.format) {
            this.options.format = "json";
        }

        this.setSubDomain(this.options.subDomain);
    }

    private setSubDomain(subdomain?: string) {
        if (!subdomain) {
            this.options.subDomain = "";
        } else if (subdomain[subdomain.length - 1] !== "-") {
            this.options.subDomain = subdomain + "-";
        } else {
            this.options.subDomain = subdomain;
        }
    }

    public async getTournamentIndex(id: string): Promise<Tournament> {
        return this.request(`/tournaments/${this.options.subDomain}${id}`, { method: "GET" }).then(
            res => res.tournament
        );
    }

    //TODO: Types
    private async request(endpoint: string, options: { [key: string]: any }): Promise<any> {
        const { method, ...otherOptions } = options;
        const propertiesToDelete = ["path", "method"];

        propertiesToDelete.forEach(prop => delete options[prop]);

        const queryParams = {
            ...keysToObject(otherOptions, camelToUnderscore),
            api_key: this.options.api_key
        };
        const response = await fetch(`${BASE_URL}${endpoint}.${this.options.format}?${serialize(queryParams)}`, {
            method: method
        });

        if (response.status >= 500 && response.status < 528)
            throw new Error(`Server Error: ${response.status} ${response.statusText}`);
        if (response.status === 400)
            throw new Error(
                Errors.ERROR_CODE_CAUSE.replace(/{code}/, "400 Bad Request").replace(
                    /{cause}/,
                    response.statusText || ""
                )
            );
        if (response.status === 401) throw new Error(Errors.INVALID_API_KEY);
        if (response.status === 422) throw new Error(Errors.UNEXPECTED_ERROR);
        if (response.status !== 200) throw new Error(response.statusText);

        const parsedResponse = await response.json().catch(() => {
            throw new Error(Errors.INVALID_RESPONSE_BODY);
        });

        if (!parsedResponse) {
            throw new Error(Errors.SOMETHING_WENT_WRONG.replace(/{cause}/, response.statusText));
        }
        return parsedResponse;
    }
}
