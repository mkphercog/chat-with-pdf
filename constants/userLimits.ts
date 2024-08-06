import byteSize from "byte-size";

export const FREE_DOC_LIMIT = 2;
export const FREE_MESSAGES_LIMIT = 3;
export const PRO_DOC_LIMIT = 20;
export const PRO_MESSAGES_LIMIT = 100;

export const FREE_FILE_MAX_SIZE_IN_BYTES = 300_000;
export const FREE_FILE_MAX_SIZE_IN_KB = byteSize(
  FREE_FILE_MAX_SIZE_IN_BYTES
).toString();
export const PRO_FILE_MAX_SIZE_IN_BYTES = 1_000_000;
export const PRO_FILE_MAX_SIZE_IN_KB = byteSize(
  PRO_FILE_MAX_SIZE_IN_BYTES
).toString();
