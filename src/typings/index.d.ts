import { SlashCommandBuilder, ClientEvents } from "discord.js";
import Bot from "../structures/Bot";

export interface Event {
    name: keyof ClientEvents;
    runOnce: boolean;
    run: Execute;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Execute = (bot: Bot, ...params: any[]) => Promise<void>;

export interface Command {
    permissions?: string[];
    cooldown?: number;
    data: SlashCommandBuilder;
    execute(...args: any): any;
}

type ExecuteCommand = (bot: Bot, interaction: ChatInputCommandInteraction, args: any[]) => Promise<void>;

export interface RequestBuilder {
    api_key: string;
    subDomain?: string;
    format?: string;
    timeout?: number;
}

export interface ITournament {
    participants: any[];
    matches: any[];
    accept_attachments: boolean;
    allow_participant_match_reporting: boolean;
    anonymous_voting: boolean;
    category: null;
    check_in_duration: null;
    completed_at: null;
    created_at: string;
    created_by_api: boolean;
    credit_capped: boolean;
    description: string;
    game_id: number;
    group_stages_enabled: boolean;
    hide_forum: boolean;
    hide_seeds: boolean;
    hold_third_place_match: boolean;
    id: number;
    max_predictions_per_user: number;
    name: string;
    notify_users_when_matches_open: boolean;
    notify_users_when_the_tournament_ends: boolean;
    open_signup: boolean;
    participants_count: number;
    prediction_method: number;
    predictions_opened_at: null;
    private: boolean;
    progress_meter: number;
    pts_for_bye: string;
    pts_for_game_tie: string;
    pts_for_game_win: string;
    pts_for_match_tie: string;
    pts_for_match_win: string;
    quick_advance: boolean;
    ranked_by: string;
    require_score_agreement: boolean;
    rr_pts_for_game_tie: string;
    rr_pts_for_game_win: string;
    rr_pts_for_match_tie: string;
    rr_pts_for_match_win: string;
    sequential_pairings: boolean;
    show_rounds: boolean;
    signup_cap: null;
    start_at: string | null;
    started_at: string;
    started_checking_in_at: null;
    state: "pending" | "underway" | "awaiting_review" | "complete";
    swiss_rounds: number;
    teams: boolean;
    tie_breaks: string[];
    tournament_type: string;
    updated_at: string;
    url: string;
    description_source: string;
    subdomain: null;
    full_challonge_url: string;
    live_image_url: string;
    sign_up_url: null;
    review_before_finalizing: boolean;
    accepting_predictions: boolean;
    participants_locked: boolean;
    game_name: string;
    participants_swappable: boolean;
    team_convertable: boolean;
    group_stages_were_started: boolean;
}

export interface IParticipant {
    id: number;
    tournament_id: number;
    name: string;
    seed: number;
    active: boolean;
    created_at: string;
    updated_at: string;
    invite_email: null | string;
    final_rank: number;
    misc: null;
    icon: null;
    on_waiting_list: boolean;
    invitation_id: null;
    group_id: null;
    checked_in_at: null;
    ranked_member_id: null;
    custom_field_response: null;
    clinch: null;
    integration_uids: null;
    challonge_username: null;
    challonge_user_id: null;
    challonge_email_address_verified: null;
    removable: boolean;
    participatable_or_invitation_attached: boolean;
    confirm_remove: boolean;
    invitation_pending: boolean;
    display_name_with_invitation_email_address: string;
    email_hash: null;
    username: null;
    display_name: string;
    attached_participatable_portrait_url: null;
    can_check_in: boolean;
    checked_in: boolean;
    reactivatable: boolean;
    check_in_open: boolean;
    group_player_ids: Array<any>;
    has_irrelevant_seed: boolean;
    ordinal_seed: string;
}

export interface IMatch {
    attachment_count: null | number;
    created_at: string;
    group_id: null | number;
    has_attachment: boolean;
    id: number;
    identifier: string;
    location: null | string;
    loser_id: null | number;
    player1_id: number;
    player1_is_prereq_match_loser: boolean;
    player1_prereq_match_id: null | number;
    player1_votes: null | number;
    player2_id: number;
    player2_is_prereq_match_loser: boolean;
    player2_prereq_match_id: null | number;
    player2_votes: null | number;
    round: number;
    scheduled_time: null | string;
    started_at: string;
    state: string;
    tournament_id: number;
    underway_at: null | string;
    updated_at: string;
    winner_id: null | number;
    prerequisite_match_ids_csv: string;
    scores_csv: string;
}
