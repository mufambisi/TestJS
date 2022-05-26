import React, { useState } from "react";

import { getCustomerId } from "src/util/jwt";
import {
  storeDismissedItem,
  hasItemBeenDismissed,
  DashboardStorageKeys,
} from "src/util/storageHelper";
import { useOnce } from "src/hooks";

interface IProps {
  dismissId: DashboardStorageKeys;
  Component: React.FC<{ close(): void }>;
}

export const DismissableComponent: React.FC<IProps> = ({
  Component,
  dismissId,
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [customerId, setCustomerId] = useState<string>();

  const dismissItem = () => {
    setShouldRender(false);
    storeDismissedItem(customerId, dismissId);
  };

  useOnce(async () => {
    const custId = await getCustomerId();
    setShouldRender(!hasItemBeenDismissed(custId, dismissId));
    setCustomerId(custId);
  });

  if (!shouldRender) {
    return null;
  }

  return <Component close={dismissItem} />;
};
