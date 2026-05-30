# Storage

Handles the storage mechanisms for the app.

Two types of storage will be used:

## KV Storage

1. Client: LocalStorage
2. Server: KV using SQlite

## Table Storage

1. Client: SQLite in OPFS
2. Server: bun sqlite

One thing to note is that this folder `storage` 
will be an universal package that handles all the platform independent
storage.

This universal library will be imported using the exports from the 
barrel file: [`storage/index.ts`](./index.ts)
