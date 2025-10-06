import toast from "react-hot-toast";

import { FullOrderERC20 } from "@airswap/utils";

import i18n from "i18next";

import CopyToast from "./CopyToast";
import ErrorToast from "./ErrorToast";
import OrderToast from "./OrderToast";

export const notifyError = (props: { heading: string; cta: string }) => {
  toast(
    (t) => (
      <ErrorToast
        onClose={() => toast.dismiss(t.id)}
        heading={props.heading}
        cta={props.cta}
      />
    ),
    {
      duration: 3000,
    }
  );
};

export const notifyOrderCreated = () => {
  toast((t) => <OrderToast onClose={() => toast.dismiss(t.id)} />, {
    duration: 3000,
  });
};

export const notifyOrderExpiry = () => {
  notifyError({
    heading: i18n.t("orders.swapRejected"),
    cta: i18n.t("orders.swapRejectedCallToAction"),
  });
};

export const notifyCopySuccess = () => {
  toast(
    (t) => (
      <CopyToast
        onClose={() => toast.dismiss(t.id)}
        heading={i18n.t("toast.copiedToClipboard")}
      />
    ),
    {
      duration: 1000,
    }
  );
};

export const notifyRejectedByUserError = () => {
  notifyError({
    heading: i18n.t("orders.swapFailed"),
    cta: i18n.t("orders.swapRejectedByUser"),
  });
};
