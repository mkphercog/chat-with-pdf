import {
  FREE_FILE_MAX_SIZE_IN_KB,
  FREE_DOC_LIMIT,
  FREE_MESSAGES_LIMIT,
  PRO_DOC_LIMIT,
  PRO_MESSAGES_LIMIT,
  PRO_FILE_MAX_SIZE_IN_KB,
} from "./";

export const PRICING_FREE_FEATURES = [
  `${FREE_DOC_LIMIT} Documents`,
  `Up to ${FREE_MESSAGES_LIMIT} messages per document`,
  `Files up to ${FREE_FILE_MAX_SIZE_IN_KB}`,
  "Try out the AI Chat Functionality",
];

export const PRICING_PRO_FEATURES = [
  `Store up to ${PRO_DOC_LIMIT} Documents`,
  `Up to ${PRO_MESSAGES_LIMIT} messages per document`,
  `Files up to ${PRO_FILE_MAX_SIZE_IN_KB}`,
  "Ability to Delete Documents",
  "Full Power AI Chat Functionality with Memory Recall",
];
