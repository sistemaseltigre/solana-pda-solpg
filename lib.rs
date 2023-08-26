use anchor_lang::prelude::*;

declare_id!("HYYjfqJ64U33qJUAmFhDNXAfgcaXs7RT3cZuUzzwUFDK");

#[program]
mod restaurant_review {
    use super::*;
    pub fn post_review(ctx: Context<ReviewAccounts>, restaurant: String, review: String, rating: u8) -> Result<()> {
        let new_review = &mut ctx.accounts.review;
        new_review.reviewer = ctx.accounts.signer.key();
        new_review.restaurant = restaurant;
        new_review.review = review;
        new_review.rating = rating;
        msg!("Restaurant review for {} - {} stars", new_review.restaurant, new_review.rating);
        msg!("Review: {}", new_review.review);

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(restaurant: String, review: String)]
pub struct ReviewAccounts<'info> {
  #[account(
        init_if_needed,
        payer = signer,
        space = 500,
        seeds = [
            restaurant.as_bytes().as_ref(), 
            signer.key().as_ref()
        ],
        bump
    )]
    pub review: Account<'info,Review>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Review {
    pub reviewer: Pubkey,
    pub restaurant: String,
    pub review: String,
    pub rating: u8
}