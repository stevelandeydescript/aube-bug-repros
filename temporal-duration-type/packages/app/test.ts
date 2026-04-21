import { proxyActivities } from '@temporalio/workflow';

// Simplified activity interface for the repro
interface Activities {
    greet(name: string): Promise<string>;
}

const activities = proxyActivities<Activities>({
    startToCloseTimeout: '1 minute',
    retry: {
        initialInterval: '1s',
        maximumInterval: '30s',
        backoffCoefficient: 2,
        maximumAttempts: 5,
    },
});

// These string values are perfectly valid Temporal durations, but under aube's
// strict resolution, ms@3.0.0-canary.1 defines StringValue as a template
// literal type like `${number} ${UnitAnyCase}`, so plain string literals like
// '1s' are not assignable without an explicit `as const` or type annotation.
//
// Under pnpm, ms@2.1.3 gets hoisted and StringValue is just `string`, so all
// of these pass without issue.
