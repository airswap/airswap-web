import { FC, PropsWithChildren, useContext, useEffect } from "react";

import { InterfaceContext } from "../../contexts/interface/Interface";
import { Container } from "./TransactionOverlay.styles";

type TransactionOverlayProps = {
  isHidden: boolean;
  className?: string;
};

const TransactionOverlay: FC<PropsWithChildren<TransactionOverlayProps>> = ({
  isHidden,
  className,
  children,
}) => {
  const { setShowTransactionOverlay } = useContext(InterfaceContext);

  useEffect(() => {
    setShowTransactionOverlay(!isHidden);
  }, [isHidden]);

  return (
    <Container isOpen={!isHidden} className={className}>
      {children}
    </Container>
  );
};

export default TransactionOverlay;
