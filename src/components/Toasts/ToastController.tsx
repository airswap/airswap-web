import toast from "react-hot-toast";
import TransactionToast from "./TransactionToast";

const formatDate = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hrs = hours % 12 ? hours % 12 : 12; // the hour '0' should be '12'
  const min = minutes < 10 ? "0" + minutes : minutes.toString();
  return hrs + ":" + min + " " + (hours >= 12 ? "pm" : "am");
};

export const notifyApproval = () =>
  toast(
    (tst) => (
      <TransactionToast
        onClose={() => toast.dismiss(tst.id)}
        duration={30000}
        startTime={formatDate(new Date())}
        type="toast:approval"
      />
    ),
    {
      duration: 30000,
    }
  );

export const notifyTransactionPending = () =>
  toast(
    (tst) => (
      <TransactionToast
        onClose={() => toast.dismiss(tst.id)}
        duration={30000}
        startTime={formatDate(new Date())}
        type="toast:transactionPending"
      />
    ),
    {
      duration: 30000,
    }
  );

export const notifyTransactionSuccess = () =>
  toast(
    (tst) => (
      <TransactionToast
        onClose={() => toast.dismiss(tst.id)}
        duration={30000}
        startTime={formatDate(new Date())}
        type="toast:transactionSuccess"
      />
    ),
    {
      duration: 30000,
    }
  );

export const notifyTransactionFail = () =>
  toast(
    (tst) => (
      <TransactionToast
        onClose={() => toast.dismiss(tst.id)}
        duration={30000}
        startTime={formatDate(new Date())}
        type="toast:transactionFail"
        error={true}
      />
    ),
    {
      duration: 30000,
    }
  );
