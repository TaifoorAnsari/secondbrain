-- CreateTable
CREATE TABLE "public"."Timeline" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TimelineEntity" (
    "timelineId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,

    CONSTRAINT "TimelineEntity_pkey" PRIMARY KEY ("timelineId","entityId")
);

-- AddForeignKey
ALTER TABLE "public"."Timeline" ADD CONSTRAINT "Timeline_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimelineEntity" ADD CONSTRAINT "TimelineEntity_timelineId_fkey" FOREIGN KEY ("timelineId") REFERENCES "public"."Timeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimelineEntity" ADD CONSTRAINT "TimelineEntity_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "public"."Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
