import React, {
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import writeTextToClipboard from "../../../../helpers/writeTextToClipboard";
import { LargePillButton } from "../../../../styled-components/Pill/Pill";
import Icon from "../../../Icon/Icon";
import { notifyCopySuccess } from "../../../Toasts/ToastController";
import { CopyLinkElement } from "./CopyLinkButton.styles";

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
        id="snavie"
        ref={copyLinkElement}
        className={className}
      >
        {location}
      </CopyLinkElement>
    );
  }

  return (
    <LargePillButton onClick={handleCopyButtonClick} className={className}>
      {t("orders.copyLink")}
      <Icon name="copy2" />
    </LargePillButton>
  );
};

export default CopyLinkButton;
