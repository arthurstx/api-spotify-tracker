-- CreateEnum
CREATE TYPE "TimeRange" AS ENUM ('SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT,
    "imageUrl" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "durationMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackArtist" (
    "trackId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,

    CONSTRAINT "TrackArtist_pkey" PRIMARY KEY ("trackId","artistId")
);

-- CreateTable
CREATE TABLE "Snapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistRanking" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "timeRange" "TimeRange" NOT NULL,

    CONSTRAINT "ArtistRanking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackRanking" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "timeRange" "TimeRange" NOT NULL,

    CONSTRAINT "TrackRanking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_spotifyId_key" ON "User"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_spotifyId_key" ON "Artist"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Track_spotifyId_key" ON "Track"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Snapshot_userId_date_key" ON "Snapshot"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistRanking_snapshotId_artistId_timeRange_key" ON "ArtistRanking"("snapshotId", "artistId", "timeRange");

-- CreateIndex
CREATE UNIQUE INDEX "TrackRanking_snapshotId_trackId_timeRange_key" ON "TrackRanking"("snapshotId", "trackId", "timeRange");

-- AddForeignKey
ALTER TABLE "TrackArtist" ADD CONSTRAINT "TrackArtist_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackArtist" ADD CONSTRAINT "TrackArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistRanking" ADD CONSTRAINT "ArtistRanking_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistRanking" ADD CONSTRAINT "ArtistRanking_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackRanking" ADD CONSTRAINT "TrackRanking_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackRanking" ADD CONSTRAINT "TrackRanking_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
