// @ts-strict-ignore
import { defaultUpdateJobs } from './defaultUpdateJobs.js';
import { createMigration } from './migrations/createMigration.js';
import { migrate } from './migrations/migrate.js';
import { migrateDown } from './migrations/migrateDown.js';
import { migrateRefresh } from './migrations/migrateRefresh.js';
import { migrateReset } from './migrations/migrateReset.js';
import { migrateStatus } from './migrations/migrateStatus.js';
const beginTransaction = ()=>Promise.resolve(null);
const rollbackTransaction = ()=>Promise.resolve(null);
const commitTransaction = ()=>Promise.resolve(null);
export function createDatabaseAdapter(args) {
    return {
        // Default 'null' transaction functions
        beginTransaction,
        commitTransaction,
        createMigration,
        migrate,
        migrateDown,
        migrateFresh: ()=>Promise.resolve(null),
        migrateRefresh,
        migrateReset,
        migrateStatus,
        rollbackTransaction,
        updateJobs: defaultUpdateJobs,
        ...args,
        // Ensure migrationDir is set
        migrationDir: args.migrationDir || 'migrations'
    };
}

//# sourceMappingURL=createDatabaseAdapter.js.map