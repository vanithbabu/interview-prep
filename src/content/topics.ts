import { JS_FUNCTIONS_TOPIC } from '@/content/javascript/functions';
import type { TopicDetail } from '@/types/content';

const TOPIC_MAP: Record<string, TopicDetail> = {
  [JS_FUNCTIONS_TOPIC.id]: JS_FUNCTIONS_TOPIC,
};

export function getTopicById(id: string): TopicDetail | undefined {
  return TOPIC_MAP[id];
}
