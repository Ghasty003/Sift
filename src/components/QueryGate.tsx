import type { UseQueryResult } from "@tanstack/react-query";
import SiftLoader from "./SiftLoader";

interface QueryGateProps {
  queries: UseQueryResult<unknown, unknown>[];
  children: () => React.ReactNode;
}

export default function QueryGate({ queries, children }: QueryGateProps) {
  if (queries.some((q) => q.isLoading)) {
    return <SiftLoader />;
  }

  if (queries.some((q) => q.isError)) {
    return (
      <div className="p-8 text-sm text-red-600">
        Something went wrong loading this page. Please try refreshing.
      </div>
    );
  }

  return <>{children()}</>;
}
