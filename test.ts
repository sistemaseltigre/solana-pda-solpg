// Step 1 - Define Review Inputs
const RESTAURANT = "Restaurante Punta Grill";
const RATING = 4;
const REVIEW = "Restaurante favorito PX!";

// Step 2 - Fetch the PDA of our Review account
const [REVIEW_PDA] = anchor.web3.PublicKey.findProgramAddressSync(

  [
    Buffer.from(RESTAURANT),
    pg.wallet.publicKey.toBuffer()
  ],

  pg.program.programId
);

console.log(`Reviewer: ${pg.wallet.publicKey.toString()}`);
console.log(`Review PDA: ${REVIEW_PDA.toString()}`);

// Step 3 - Fetch Latest Blockhash
let latestBlockhash = await pg.connection.getLatestBlockhash('finalized');

// Step 4 - Send and Confirm the Transaction
const tx = await pg.program.methods
  .postReview(
    RESTAURANT,
    REVIEW,
    RATING
  )
  .accounts({ review: REVIEW_PDA })
  .rpc();

await pg.connection.confirmTransaction({
  signature: tx,
  blockhash: latestBlockhash.blockhash,
  lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
});

console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);

// Step 5 - Fetch the data account and log results
const data = await pg.program.account.review.fetch(REVIEW_PDA);
console.log(`Reviewer: `,data.reviewer.toString());
console.log(`Restaurant: `,data.restaurant);
console.log(`Review: `,data.review);
console.log(`Rating: `,data.rating);