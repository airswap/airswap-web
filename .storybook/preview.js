import { Suspense } from "react";
import "../src/i18n/i18n";
import "../src/index.css";

// Suspense needed for i18n.
export const decorators = [
  (story, context) => {
    return (
      <Suspense fallback="Loading...">
        <div className="flex">{story(context)}</div>
      </Suspense>
    );
  },
];
