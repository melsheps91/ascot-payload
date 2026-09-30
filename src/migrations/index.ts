import * as migration_20260930_131158_initial from './20260930_131158_initial';
import * as migration_20260930_131606_storage_prefix from './20260930_131606_storage_prefix';

export const migrations = [
  {
    up: migration_20260930_131158_initial.up,
    down: migration_20260930_131158_initial.down,
    name: '20260930_131158_initial',
  },
  {
    up: migration_20260930_131606_storage_prefix.up,
    down: migration_20260930_131606_storage_prefix.down,
    name: '20260930_131606_storage_prefix'
  },
];
