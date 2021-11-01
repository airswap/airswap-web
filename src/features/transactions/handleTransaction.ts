import { mineTransaction, revertTransaction } from "./transactionActions";
import { SubmittedTransaction } from "./transactionsSlice";

/**
 * if pending, call getTransaction to see if it was a success/failure/pending
 * update accordingly. if pending: wait() and poll at a sensible interval.
 * this is only good for request-for-quote orders
 * @param transactionInState
 * @param walletHasChanged
 * @param dispatch
 * @param library
 */
async function handleTransaction(
  transactionInState: SubmittedTransaction,
  walletHasChanged: boolean,
  dispatch: any,
  library: any
) {
  if (transactionInState.status === "processing" && transactionInState.hash) {
    console.debug("inside handleTransaction");
    let receipt = await library.getTransactionReceipt(transactionInState.hash);
    if (receipt !== null) {
      if (walletHasChanged) return;
      const status = receipt.status;
      console.debug({ status, receipt, tx: transactionInState });
      if (status === 1)
        dispatch(mineTransaction({ hash: transactionInState.hash }));
      // success
      else if (status === 0)
        dispatch(
          revertTransaction({
            hash: transactionInState.hash,
            reason: "Reverted",
          })
        ); // reverted
      return;
      // Orders will automatically be picked up by swapEventSubscriber
    } else if (transactionInState.type !== "Order") {
      // Receipt was null, so the transaction is incomplete
      // Try to get a reference to the transaction in the mem pool - this
      // can sometimes also return null (e.g. gas price too low or tx only
      // recently sent) depending on backend.
      const transaction = await library.getTransaction(transactionInState.hash);
      if (transaction) {
        try {
          await transaction.wait(1);
          if (!walletHasChanged)
            dispatch(mineTransaction({ hash: transactionInState.hash })); // success
        } catch (err) {
          console.error(err);
          if (!walletHasChanged)
            dispatch(
              revertTransaction({
                hash: transactionInState.hash,
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
          receipt = await library!.getTransactionReceipt(
            transactionInState.hash
          );
        }
        if (!receipt || receipt.status === 0) {
          if (!walletHasChanged)
            dispatch(
              revertTransaction({
                hash: transactionInState.hash,
                reason: "Reverted",
              })
            );
        } else {
          if (!walletHasChanged)
            dispatch(mineTransaction({ hash: transactionInState.hash })); // success
        }
      }
    }
  }
}
export default handleTransaction;
