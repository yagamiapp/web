-- CreateTable
CREATE TABLE "Global" (
    "id" SERIAL NOT NULL,
    "ties" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Global_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OsuBadge" (
    "id" SERIAL NOT NULL,
    "awarded_at" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "OsuBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWithOsuBadge" (
    "userId" INTEGER NOT NULL,
    "badgeId" INTEGER NOT NULL,

    CONSTRAINT "UserWithOsuBadge_pkey" PRIMARY KEY ("userId","badgeId")
);

-- CreateTable
CREATE TABLE "CustomBadge" (
    "id" SERIAL NOT NULL,
    "awarded_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "CustomBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWithCustomBadge" (
    "userId" INTEGER NOT NULL,
    "badgeId" INTEGER NOT NULL,

    CONSTRAINT "UserWithCustomBadge_pkey" PRIMARY KEY ("userId","badgeId")
);

-- CreateTable
CREATE TABLE "UsersHostingTournament" (
    "userId" INTEGER NOT NULL,
    "tourney" INTEGER NOT NULL,

    CONSTRAINT "UsersHostingTournament_pkey" PRIMARY KEY ("userId","tourney")
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    "cover_url" TEXT NOT NULL,
    "ranked_score" BIGINT NOT NULL,
    "play_count" INTEGER NOT NULL,
    "total_score" BIGINT NOT NULL,
    "pp_rank" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "level_progress" INTEGER NOT NULL,
    "hit_accuracy" DOUBLE PRECISION NOT NULL,
    "pp" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordAccount" (
    "osuId" INTEGER NOT NULL,
    "id" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "discriminator" TEXT NOT NULL,
    "flags" INTEGER NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "DiscordAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OsuOauth" (
    "userId" INTEGER NOT NULL,
    "last_update" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "access_token" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,

    CONSTRAINT "OsuOauth_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "DiscordOauth" (
    "userId" TEXT NOT NULL,
    "last_update" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "access_token" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "scope" TEXT NOT NULL,

    CONSTRAINT "DiscordOauth_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "osuId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "guild_id" TEXT NOT NULL,
    "change_nickname" BOOLEAN NOT NULL,
    "linked_role" TEXT,
    "player_role" TEXT,
    "match_results_channel" TEXT,
    "manager_admin_disabled" BOOLEAN NOT NULL DEFAULT false,
    "active_tournament" INTEGER,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("guild_id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" SERIAL NOT NULL,
    "acronym" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "banner_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "force_nf" BOOLEAN NOT NULL,
    "icon_url" TEXT NOT NULL,
    "score_mode" INTEGER NOT NULL,
    "team_mode" INTEGER NOT NULL,
    "team_size" INTEGER NOT NULL,
    "x_v_x_mode" INTEGER NOT NULL,
    "allow_registrations" BOOLEAN NOT NULL,
    "Guild_id" TEXT,
    "delete_warning" BOOLEAN,
    "fm_mods" INTEGER NOT NULL DEFAULT 1,
    "double_pick" INTEGER NOT NULL DEFAULT 1,
    "double_ban" INTEGER NOT NULL DEFAULT 1,
    "private" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModMultiplier" (
    "id" SERIAL NOT NULL,
    "tournament_id" INTEGER NOT NULL,
    "modString" TEXT NOT NULL,
    "matchExactly" BOOLEAN NOT NULL DEFAULT false,
    "multiplier" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ModMultiplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" SERIAL NOT NULL,
    "acronym" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bans" INTEGER NOT NULL,
    "best_of" INTEGER NOT NULL,
    "delete_warning" TEXT,
    "show_mappool" BOOLEAN NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "mappoolId" INTEGER,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mappool" (
    "id" SERIAL NOT NULL,
    "global" BOOLEAN NOT NULL DEFAULT false,
    "tournament_name" TEXT,
    "tournament_acronym" TEXT,
    "tournament_iteration" TEXT,
    "round_name" TEXT,
    "round_acronym" TEXT,

    CONSTRAINT "Mappool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamInvite" (
    "inviteeUserId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "TeamInvite_pkey" PRIMARY KEY ("inviteeUserId","teamId")
);

-- CreateTable
CREATE TABLE "MapInPool" (
    "identifier" TEXT NOT NULL,
    "mods" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "modPriority" INTEGER NOT NULL DEFAULT 0,
    "mappoolId" INTEGER NOT NULL,

    CONSTRAINT "MapInPool_pkey" PRIMARY KEY ("identifier","mappoolId")
);

-- CreateTable
CREATE TABLE "Map" (
    "beatmap_id" TEXT NOT NULL,
    "fetch_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved" TEXT,
    "approved_date" TIMESTAMP(3),
    "artist" TEXT,
    "artist_unicode" TEXT,
    "audio_unavailable" TEXT,
    "beatmapset_id" TEXT,
    "bpm" TEXT,
    "count_normal" TEXT,
    "count_slider" TEXT,
    "count_spinner" TEXT,
    "creator" TEXT,
    "creator_id" TEXT,
    "diff_aim" TEXT,
    "diff_speed" TEXT,
    "diff_approach" TEXT,
    "diff_drain" TEXT,
    "diff_overall" TEXT,
    "diff_size" TEXT,
    "difficultyrating" TEXT,
    "download_unavailable" TEXT,
    "favourite_count" TEXT,
    "file_md5" TEXT,
    "genre_id" TEXT,
    "hit_length" TEXT,
    "language_id" TEXT,
    "last_update" TIMESTAMP(3),
    "max_combo" TEXT,
    "mode" TEXT,
    "packs" TEXT,
    "passcount" TEXT,
    "playcount" TEXT,
    "rating" TEXT,
    "source" TEXT,
    "storyboard" TEXT,
    "submit_date" TIMESTAMP(3),
    "tags" TEXT,
    "title" TEXT,
    "title_unicode" TEXT,
    "total_length" TEXT,
    "version" TEXT,
    "video" TEXT,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("beatmap_id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon_url" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "scrim" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInTeam" (
    "osuId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "member_order" INTEGER NOT NULL DEFAULT 0,
    "delete_warning" BOOLEAN,

    CONSTRAINT "UserInTeam_pkey" PRIMARY KEY ("osuId","teamId")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "start_time" TIMESTAMP(3),
    "message_id" TEXT,
    "channel_id" TEXT,
    "mp_link" TEXT,
    "waiting_on" INTEGER,
    "roundId" INTEGER,
    "state" INTEGER NOT NULL,
    "scrim" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrimSettings" (
    "matchId" INTEGER NOT NULL,
    "bans" INTEGER NOT NULL,
    "best_of" INTEGER NOT NULL,

    CONSTRAINT "ScrimSettings_pkey" PRIMARY KEY ("matchId")
);

-- CreateTable
CREATE TABLE "TeamInMatch" (
    "matchId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "roll" INTEGER,
    "pick_order" INTEGER,
    "ban_order" INTEGER,
    "aborts" INTEGER NOT NULL DEFAULT 0,
    "faults" INTEGER NOT NULL DEFAULT 0,
    "warmed_up" BOOLEAN NOT NULL DEFAULT false,
    "winner" BOOLEAN,

    CONSTRAINT "TeamInMatch_pkey" PRIMARY KEY ("teamId","matchId")
);

-- CreateTable
CREATE TABLE "MapInMatch" (
    "matchId" INTEGER NOT NULL,
    "mapIdentifier" TEXT NOT NULL,
    "poolId" INTEGER NOT NULL,
    "bannedByTeamId" INTEGER,
    "bannedByMatchId" INTEGER,
    "pickedByTeamId" INTEGER,
    "pickedByMatchId" INTEGER,
    "pickNumber" INTEGER,
    "pickTeamNumber" INTEGER,
    "wonByTeamId" INTEGER,
    "wonByMatchId" INTEGER,

    CONSTRAINT "MapInMatch_pkey" PRIMARY KEY ("mapIdentifier","matchId")
);

-- CreateTable
CREATE TABLE "QualifierRound" (
    "id" SERIAL NOT NULL,
    "mappoolId" INTEGER NOT NULL,

    CONSTRAINT "QualifierRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualifierMatch" (
    "id" SERIAL NOT NULL,
    "map_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "QualifierMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamInQualifierMatch" (
    "teamId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,

    CONSTRAINT "TeamInQualifierMatch_pkey" PRIMARY KEY ("teamId","matchId")
);

-- CreateTable
CREATE TABLE "AutoHostRotate" (
    "osuId" INTEGER NOT NULL,
    "mp_link" TEXT NOT NULL,
    "min_stars" DOUBLE PRECISION,
    "max_stars" DOUBLE PRECISION,
    "min_length" INTEGER,
    "max_length" INTEGER,
    "min_rank" INTEGER,
    "max_rank" INTEGER,
    "currentHostId" INTEGER,

    CONSTRAINT "AutoHostRotate_pkey" PRIMARY KEY ("osuId")
);

-- CreateTable
CREATE TABLE "AutoHostRotatePlayer" (
    "id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "lobbyId" INTEGER NOT NULL,

    CONSTRAINT "AutoHostRotatePlayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Round_mappoolId_key" ON "Round"("mappoolId");

-- CreateIndex
CREATE UNIQUE INDEX "QualifierRound_mappoolId_key" ON "QualifierRound"("mappoolId");

-- CreateIndex
CREATE UNIQUE INDEX "AutoHostRotate_currentHostId_key" ON "AutoHostRotate"("currentHostId");

-- AddForeignKey
ALTER TABLE "UserWithOsuBadge" ADD CONSTRAINT "UserWithOsuBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWithOsuBadge" ADD CONSTRAINT "UserWithOsuBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "OsuBadge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWithCustomBadge" ADD CONSTRAINT "UserWithCustomBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWithCustomBadge" ADD CONSTRAINT "UserWithCustomBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "CustomBadge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersHostingTournament" ADD CONSTRAINT "UsersHostingTournament_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersHostingTournament" ADD CONSTRAINT "UsersHostingTournament_tourney_fkey" FOREIGN KEY ("tourney") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordAccount" ADD CONSTRAINT "DiscordAccount_osuId_fkey" FOREIGN KEY ("osuId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OsuOauth" ADD CONSTRAINT "OsuOauth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordOauth" ADD CONSTRAINT "DiscordOauth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "DiscordAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_osuId_fkey" FOREIGN KEY ("osuId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_Guild_id_fkey" FOREIGN KEY ("Guild_id") REFERENCES "Guild"("guild_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModMultiplier" ADD CONSTRAINT "ModMultiplier_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_mappoolId_fkey" FOREIGN KEY ("mappoolId") REFERENCES "Mappool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvite" ADD CONSTRAINT "TeamInvite_inviteeUserId_fkey" FOREIGN KEY ("inviteeUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvite" ADD CONSTRAINT "TeamInvite_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapInPool" ADD CONSTRAINT "MapInPool_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("beatmap_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapInPool" ADD CONSTRAINT "MapInPool_mappoolId_fkey" FOREIGN KEY ("mappoolId") REFERENCES "Mappool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInTeam" ADD CONSTRAINT "UserInTeam_osuId_fkey" FOREIGN KEY ("osuId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInTeam" ADD CONSTRAINT "UserInTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrimSettings" ADD CONSTRAINT "ScrimSettings_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInMatch" ADD CONSTRAINT "TeamInMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInMatch" ADD CONSTRAINT "TeamInMatch_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapInMatch" ADD CONSTRAINT "MapInMatch_mapIdentifier_poolId_fkey" FOREIGN KEY ("mapIdentifier", "poolId") REFERENCES "MapInPool"("identifier", "mappoolId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapInMatch" ADD CONSTRAINT "MapInMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapInMatch" ADD CONSTRAINT "MapInMatch_bannedByMatchId_bannedByTeamId_fkey" FOREIGN KEY ("bannedByMatchId", "bannedByTeamId") REFERENCES "TeamInMatch"("matchId", "teamId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapInMatch" ADD CONSTRAINT "MapInMatch_pickedByMatchId_pickedByTeamId_fkey" FOREIGN KEY ("pickedByMatchId", "pickedByTeamId") REFERENCES "TeamInMatch"("matchId", "teamId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapInMatch" ADD CONSTRAINT "MapInMatch_wonByMatchId_wonByTeamId_fkey" FOREIGN KEY ("wonByMatchId", "wonByTeamId") REFERENCES "TeamInMatch"("matchId", "teamId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualifierRound" ADD CONSTRAINT "QualifierRound_mappoolId_fkey" FOREIGN KEY ("mappoolId") REFERENCES "Mappool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInQualifierMatch" ADD CONSTRAINT "TeamInQualifierMatch_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInQualifierMatch" ADD CONSTRAINT "TeamInQualifierMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "QualifierMatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoHostRotate" ADD CONSTRAINT "AutoHostRotate_osuId_fkey" FOREIGN KEY ("osuId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoHostRotate" ADD CONSTRAINT "AutoHostRotate_currentHostId_fkey" FOREIGN KEY ("currentHostId") REFERENCES "AutoHostRotatePlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoHostRotatePlayer" ADD CONSTRAINT "AutoHostRotatePlayer_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "AutoHostRotate"("osuId") ON DELETE CASCADE ON UPDATE CASCADE;
