import type { UseQueryResult } from '@tanstack/react-query';

interface QueryGateProps {
  queries: UseQueryResult<unknown, unknown>[];
  children: () => React.ReactNode;
}

/**
 * Wrap route content that depends on one or more queries. Renders a loading
 * state until all queries have data, an error state if any failed, and only
 * then calls `children()` — so route components never have to null-check
 * `query.data` themselves.
 */
export default function QueryGate({ queries, children }: QueryGateProps) {
  if (queries.some((q) => q.isLoading)) {
    return (
      <div className="p-8 text-sm text-muted-foreground">
        Loading…
      </div>
    );
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
