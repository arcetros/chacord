import { SlashCommandBuilder } from "discord.js";

export interface Command {
    permissions?: string[];
    cooldown?: number;
    data: SlashCommandBuilder;
    execute(...args: any): any;
}

export interface RequestBuilder {
    api_key: string;
    subDomain?: string;
    format?: string;
    timeout?: number;
}

export interface ITournament {
    participants?: any[];
    matches?: any[];
    acceptAttachments: boolean;
    allowParticipantMatchReporting: boolean;
    anonymousVoting: boolean;
    category: null;
    checkInDuration: null;
    completedAt: null;
    createdAt: Date;
    createdByAPI: boolean;
    creditCapped: boolean;
    description: string;
    gameID: number;
    groupStagesEnabled: boolean;
    hideForum: boolean;
    hideSeeds: boolean;
    holdThirdPlaceMatch: boolean;
    id: number;
    maxPredictionsPerUser: number;
    name: string;
    notifyUsersWhenMatchesOpen: boolean;
    notifyUsersWhenTheTournamentEnds: boolean;
    openSignup: boolean;
    participantsCount: number;
    predictionMethod: number;
    predictionsOpenedAt: null;
    private: boolean;
    progressMeter: number;
    ptsForBye: string;
    ptsForGameTie: string;
    ptsForGameWin: string;
    ptsForMatchTie: string;
    ptsForMatchWin: string;
    quickAdvance: boolean;
    rankedBy: string;
    requireScoreAgreement: boolean;
    rrPtsForGameTie: string;
    rrPtsForGameWin: string;
    rrPtsForMatchTie: string;
    rrPtsForMatchWin: string;
    sequentialPairings: boolean;
    showRounds: boolean;
    signupCap: null;
    startAt: null;
    startedAt: Date;
    startedCheckingInAt: null;
    state: string;
    swissRounds: number;
    teams: boolean;
    tieBreaks: string[];
    tournamentType: string;
    updatedAt: Date;
    url: string;
    descriptionSource: string;
    subdomain: null;
    fullChallongeURL: string;
    liveImageURL: string;
    signUpURL: null;
    reviewBeforeFinalizing: boolean;
    acceptingPredictions: boolean;
    participantsLocked: boolean;
    gameName: string;
    participantsSwappable: boolean;
    teamConvertable: boolean;
    groupStagesWereStarted: boolean;
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
