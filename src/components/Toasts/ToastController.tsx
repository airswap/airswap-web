import toast from "react-hot-toast";

import TransactionToast from "./TransactionToast";

export const notifyTransactionSuccess = () =>
  toast((t) => <TransactionToast onClose={() => toast.dismiss(t.id)} />, {
    duration: 20000,
  });

export const notifyTransactionFail = () =>
  toast(
    (t) => (
      <TransactionToast onClose={() => toast.dismiss(t.id)} error={true} />
    ),
    {
      duration: 20000,
    }
  );
