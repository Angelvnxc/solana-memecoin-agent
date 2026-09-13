private extractHolderAccounts(
  accounts: TokenAccount[],
): HolderAccountBalance[] {
  const holders: HolderAccountBalance[] =
    [];

  for (const account of accounts) {
    const info =
      account.account?.data?.parsed?.info;

    const owner =
      info?.owner;

    const amount =
      info?.tokenAmount?.amount;

    if (
      !account.pubkey ||
      !owner ||
      !amount
    ) {
      continue;
    }

    const tokenAmount =
      Number(amount);

    if (
      !Number.isFinite(tokenAmount) ||
      tokenAmount <= 0
    ) {
      continue;
    }

    holders.push({
      tokenAccountAddress:
        account.pubkey,

      walletAddress:
        owner,

      tokenAmount,
    });
  }

  return holders;
}