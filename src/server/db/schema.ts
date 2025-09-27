/**
 * Main Schema File - Re-exports all tables and types from separate schema files
 * 
 * This approach improves maintainability by organizing each table in its own file.
 * All tables and types are re-exported here for easy importing throughout the app.
 */

// Import all table schemas
export * from "./schemas/coin-collection";
export * from "./schemas/somnus-collection";
export * from "./schemas/test";
