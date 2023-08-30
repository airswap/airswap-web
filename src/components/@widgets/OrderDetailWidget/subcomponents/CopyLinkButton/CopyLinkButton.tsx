import React, {
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import writeTextToClipboard from "../../../../../helpers/writeTextToClipboard";
import { notifyCopySuccess } from "../../../../Toasts/ToastController";
import { CopyLinkElement, StyledButton } from "./CopyLinkButton.styles";

interface CopyLinkButtonProps {
  className?: string;
}

const CopyLinkButton: FC<CopyLinkButtonProps> = ({
  className = "",
}): ReactElement => {
  const { t } = useTranslation();
  const copyLinkElement = useRef<HTMLDivElement>(null);

  const [showFallback, setShowFallback] = useState(false);
  const location = useMemo(() => window.location.toString(), []);

  const handleCopyButtonClick = async () => {
    const isCopySuccess = await writeTextToClipboard(location);

    if (!isCopySuccess) {
      setShowFallback(true);

      return;
    }

    notifyCopySuccess();
  };

  useEffect(() => {
    if (!copyLinkElement.current) {
      return;
    }

    const range = document.createRange();
    range.selectNode(copyLinkElement.current);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
  }, [showFallback]);

  if (showFallback) {
    return (
      <CopyLinkElement
        as="div"
        id="copy-link-element"
        ref={copyLinkElement}
        className={className}
      >
        {location}
      </CopyLinkElement>
    );
  }

  return (
    <StyledButton
      icon="copy2"
      intent="primary"
      onClick={handleCopyButtonClick}
      className={className}
    >
      {t("orders.copyLink")}
    </StyledButton>
  );
};

export default CopyLinkButton;
