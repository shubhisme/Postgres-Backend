-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "fromID" TEXT NOT NULL,
    "toID" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromID_fkey" FOREIGN KEY ("fromID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toID_fkey" FOREIGN KEY ("toID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
