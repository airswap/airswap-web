import toast from "react-hot-toast";
import TransactionToast from "./TransactionToast";

// toast for
export const notifyApproval = () =>
  toast(
    (t) => (
      <TransactionToast
        onClose={() => toast.dismiss(t.id)}
        duration={30}
        startTime={new Date()}
        text="Your transaction has been sent to the network."
      />
    ),
    {
      duration: 300000,
    }
  );
