import { EventEmitter } from "events";

import { Tournament } from "./Tournament";
import { Errors } from "./Errors";
import { serialize, keysToObject, camelToUnderscore } from "../utils";
import { RequestBuilder } from "../typings";
import { Participant } from "./Participant";
import { Matches } from "./Matches";

const BASE_URL = "https://api.challonge.com/v1/tournaments";

//credits: https://github.com/Tidwell/node-challonge

export class Client extends EventEmitter {
    private options: RequestBuilder;
    public tournament: Tournament;
    public participant: Participant;
    public matches: Matches;

    /**
     *
     * @param options.api_key - Your API key (required unless you're using HTTP basic authentication)
     * @param options.subDomain - Sets the subdomain and automatically passes tournament[subdomain] and prefixes the subdomain to tournament urls.  If you don't want to pass a subdomain to the constructor, and want to use an organization (or multiple organizations), you must use client.setSubdomain('subdomain') before making api calls.
     * @param options.format - The format of the response data. Defaults to 'json'.  If set to 'json', will return javascript objects.  Anything else (including 'xml') will return the raw text string.
     */
    constructor(options: RequestBuilder) {
        super();
        this.options = options || {};

        if (typeof options != "object") {
            throw new Error("You have to specify options in client constructor");
        }
        if (!options.hasOwnProperty.call(options, "api_key")) {
            throw new Error("You have to specify Challonge API key");
        }
        if (!this.options.format) {
            this.options.format = "json";
        }
        this.setSubDomain(this.options.subDomain);
        this.tournament = new Tournament(this.options, this);
        this.participant = new Participant(this.options, this);
        this.matches = new Matches(this.options, this);
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

    //TODO: Types
    public async request(endpoint: string, options: { [key: string]: any }): Promise<any> {
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

        console.log(`${BASE_URL}${endpoint}.${this.options.format}?${serialize(queryParams)}`);

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
        if (response.status === 422) {
            const errorResponse = await response.json().catch(() => null);
            if (errorResponse && errorResponse.errors && errorResponse.errors.length > 0) {
                throw new Error(errorResponse.errors[0]);
            } else {
                throw new Error(Errors.UNEXPECTED_ERROR);
            }
        }
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
