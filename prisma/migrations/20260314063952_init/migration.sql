-- CreateTable
CREATE TABLE "bills" (
    "id" TEXT NOT NULL,
    "bill_type" TEXT NOT NULL,
    "bill_number" INTEGER NOT NULL,
    "bill_year" INTEGER NOT NULL,
    "title_fi" TEXT NOT NULL,
    "title_sv" TEXT,
    "summary_fi" TEXT,
    "category" TEXT,
    "current_stage" TEXT NOT NULL DEFAULT 'submitted',
    "stage_updated_at" TIMESTAMP(3),
    "submitted_date" DATE,
    "sponsor" TEXT,
    "urgency" TEXT NOT NULL DEFAULT 'normal',
    "keywords" TEXT[],
    "eduskunta_url" TEXT,
    "raw_xml" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "committee_assignments" (
    "id" SERIAL NOT NULL,
    "bill_id" TEXT NOT NULL,
    "committee_code" TEXT NOT NULL,
    "committee_name_fi" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "assigned_date" DATE,
    "report_id" TEXT,
    "report_date" DATE,

    CONSTRAINT "committee_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_hearings" (
    "id" SERIAL NOT NULL,
    "bill_id" TEXT NOT NULL,
    "committee_code" TEXT NOT NULL,
    "expert_name" TEXT NOT NULL,
    "expert_organization" TEXT,
    "hearing_date" DATE,
    "position" TEXT,
    "summary_fi" TEXT,
    "document_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expert_hearings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "bill_id" TEXT,
    "vote_date" TIMESTAMP(3),
    "votes_for" INTEGER NOT NULL DEFAULT 0,
    "votes_against" INTEGER NOT NULL DEFAULT 0,
    "votes_absent" INTEGER NOT NULL DEFAULT 0,
    "votes_empty" INTEGER NOT NULL DEFAULT 0,
    "result" TEXT,
    "session_id" TEXT,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mp_votes" (
    "id" SERIAL NOT NULL,
    "vote_id" TEXT NOT NULL,
    "mp_id" TEXT NOT NULL,
    "mp_name" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "vote_value" TEXT NOT NULL,

    CONSTRAINT "mp_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "bill_id" TEXT,
    "doc_type" TEXT NOT NULL,
    "title_fi" TEXT,
    "published_date" DATE,
    "eduskunta_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mps" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "constituency" TEXT,
    "photo_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "mps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bills_current_stage_idx" ON "bills"("current_stage");

-- CreateIndex
CREATE INDEX "bills_bill_year_idx" ON "bills"("bill_year");

-- CreateIndex
CREATE INDEX "bills_category_idx" ON "bills"("category");

-- CreateIndex
CREATE INDEX "bills_submitted_date_idx" ON "bills"("submitted_date" DESC);

-- CreateIndex
CREATE INDEX "committee_assignments_bill_id_idx" ON "committee_assignments"("bill_id");

-- CreateIndex
CREATE UNIQUE INDEX "committee_assignments_bill_id_committee_code_key" ON "committee_assignments"("bill_id", "committee_code");

-- CreateIndex
CREATE INDEX "expert_hearings_bill_id_idx" ON "expert_hearings"("bill_id");

-- CreateIndex
CREATE INDEX "votes_bill_id_idx" ON "votes"("bill_id");

-- CreateIndex
CREATE INDEX "mp_votes_vote_id_idx" ON "mp_votes"("vote_id");

-- CreateIndex
CREATE INDEX "mp_votes_party_idx" ON "mp_votes"("party");

-- CreateIndex
CREATE UNIQUE INDEX "mp_votes_vote_id_mp_id_key" ON "mp_votes"("vote_id", "mp_id");

-- CreateIndex
CREATE INDEX "documents_bill_id_idx" ON "documents"("bill_id");

-- AddForeignKey
ALTER TABLE "committee_assignments" ADD CONSTRAINT "committee_assignments_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_hearings" ADD CONSTRAINT "expert_hearings_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mp_votes" ADD CONSTRAINT "mp_votes_vote_id_fkey" FOREIGN KEY ("vote_id") REFERENCES "votes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE SET NULL ON UPDATE CASCADE;
