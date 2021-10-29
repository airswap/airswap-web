import { mineTransaction, revertTransaction } from "./transactionActions";

/**
 * if pending, call getTransaction to see if it was a success/failure/pending
 * update accordingly. if pending: wait() and poll at a sensible interval.
 * this is only good for request-for-quote orders
 * @param tx
 * @param walletHasChanged
 * @param dispatch
 * @param library
 */
async function handleTransaction(
  tx: any,
  walletHasChanged: boolean,
  dispatch: any,
  library: any
) {
  if (tx.status === "processing" && tx.hash) {
    console.debug("inside handleTransaction");
    let receipt = await library.getTransactionReceipt(tx.hash);
    if (receipt !== null) {
      if (walletHasChanged) return;
      const status = receipt.status;
      console.debug({ status, receipt, tx });
      if (status === 1)
        dispatch(
          mineTransaction({ nonce: tx.nonce, hash: tx.hash, signerWallet: "" })
        );
      // success
      else if (status === 0)
        dispatch(
          revertTransaction({
            hash: tx.hash,
            reason: "Reverted",
          })
        ); // reverted
      return;
    } else {
      // Receipt was null, so the transaction is incomplete
      // Try to get a reference to the transaction in the mem pool - this
      // can sometimes also return null (e.g. gas price too low or tx only
      // recently sent) depending on backend.
      const transaction = await library.getTransaction(tx.hash);
      if (transaction) {
        try {
          await transaction.wait(1);
          if (!walletHasChanged)
            dispatch(
              mineTransaction({ nonce: tx.nonce, hash: "", signerWallet: "" })
            ); // success
        } catch (err) {
          console.error(err);
          if (!walletHasChanged)
            dispatch(
              revertTransaction({
                hash: tx.hash,
                reason: "Reverted",
              })
            );
        }
        return;
      } else {
        // if transaction === null, we poll at intervals
        // assume failed after 30 mins
        const assumedFailureTime = Date.now() + 30 * 60 * 1000;
        while (receipt === null && Date.now() <= assumedFailureTime) {
          // wait 30 seconds
          await new Promise((res) => setTimeout(res, 30000));
          receipt = await library!.getTransactionReceipt(tx.hash);
        }
        if (!receipt || receipt.status === 0) {
          if (!walletHasChanged)
            dispatch(
              revertTransaction({
                hash: tx.hash,
                reason: "Reverted",
              })
            );
        } else {
          if (!walletHasChanged)
            dispatch(
              mineTransaction({
                nonce: tx.nonce,
                hash: tx.hash,
                signerWallet: "",
              })
            ); // success
        }
      }
    }
  }
}
export default handleTransaction;
