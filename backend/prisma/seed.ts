import '../src/config/env.js';
import { randomBytes, scryptSync } from 'node:crypto';
import { type Prisma, PrismaClient } from '@prisma/client';

import { CATEGORIES_FEED } from '../src/data/categoriesFeed.js';
import { ALL_QUESTIONS_FEED } from '../src/data/questionsFeed.js';
import { generateTopicExamplesBatch, getDynamicTopicLesson } from '../src/services/content.service.js';

const prisma = new PrismaClient();
const useLlm = process.argv.includes('--llm');

function hashSeedPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

async function main() {
  console.log(`Seeding PostgreSQL (${useLlm ? 'with Local LLM generation' : 'from curriculum feed'})...`);

  await prisma.user.upsert({
    where: { email: 'developer@interviewprep.app' },
    update: {},
    create: {
      id: 'usr-developer-1',
      email: 'developer@interviewprep.app',
      name: 'Developer',
      passwordHash: hashSeedPassword('Interview@2026'),
    },
  });

  for (let i = 0; i < CATEGORIES_FEED.length; i++) {
    const cat = CATEGORIES_FEED[i];
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        shortDescription: cat.shortDescription,
        icon: cat.icon,
        accentColor: cat.accentColor,
        sortOrder: i,
      },
      create: {
        id: cat.id,
        name: cat.name,
        shortDescription: cat.shortDescription,
        icon: cat.icon,
        accentColor: cat.accentColor,
        sortOrder: i,
      },
    });

    for (const topic of cat.topics) {
      const lesson = getDynamicTopicLesson(topic.id);

      await prisma.topic.upsert({
        where: { id: topic.id },
        update: {
          title: topic.title,
          level: topic.level,
          estimatedMinutes: topic.estimatedMinutes,
          description: topic.description,
          introduction: lesson?.coreQuestion ?? null,
          simpleExplanation: lesson?.simpleHumanAnswer ?? null,
          whyWeUseIt: lesson?.realWorldExample ?? null,
          howItWorksInternally: lesson?.interviewSpeakingAnswer ?? null,
          syntaxVariationsJson: (lesson?.codeExamples ?? undefined) as unknown as Prisma.InputJsonValue | undefined,
          interviewQuestionsJson: (lesson?.followUpQuestions ?? undefined) as unknown as Prisma.InputJsonValue | undefined,
        },
        create: {
          id: topic.id,
          categoryId: cat.id,
          slug: topic.slug,
          title: topic.title,
          level: topic.level,
          estimatedMinutes: topic.estimatedMinutes,
          description: topic.description,
          introduction: lesson?.coreQuestion ?? null,
          simpleExplanation: lesson?.simpleHumanAnswer ?? null,
          whyWeUseIt: lesson?.realWorldExample ?? null,
          howItWorksInternally: lesson?.interviewSpeakingAnswer ?? null,
          syntaxVariationsJson: (lesson?.codeExamples ?? undefined) as unknown as Prisma.InputJsonValue | undefined,
          interviewQuestionsJson: (lesson?.followUpQuestions ?? undefined) as unknown as Prisma.InputJsonValue | undefined,
        },
      });

      if (useLlm) {
        const existingCount = await prisma.topicExample.count({ where: { topicId: topic.id } });
        if (existingCount < 50) {
          for (const batchStart of [1, 11, 21, 31, 41] as const) {
            const batch = await generateTopicExamplesBatch(topic.id, batchStart);
            if (!batch) continue;
            for (const ex of batch.examples) {
              await prisma.topicExample.upsert({
                where: { id: ex.id },
                update: {
                  title: ex.title,
                  groupTitle: ex.groupTitle,
                  concept: ex.concept,
                  syntax: ex.syntax,
                  code: ex.code,
                  expectedOutput: ex.expectedOutput,
                  explanation: ex.explanation,
                  realWorldUsage: ex.realWorldUsage,
                  interviewTip: ex.interviewTip,
                },
                create: {
                  id: ex.id,
                  topicId: topic.id,
                  number: ex.number,
                  title: ex.title,
                  groupTitle: ex.groupTitle,
                  concept: ex.concept,
                  syntax: ex.syntax,
                  code: ex.code,
                  expectedOutput: ex.expectedOutput,
                  explanation: ex.explanation,
                  realWorldUsage: ex.realWorldUsage,
                  interviewTip: ex.interviewTip,
                },
              });
            }
          }
          console.log(`Fed 50 examples to DB for ${topic.id}`);
        }
      }
    }
  }

  for (const q of ALL_QUESTIONS_FEED) {
    await prisma.interviewQuestion.upsert({
      where: { id: q.id },
      update: {
        title: q.title,
        difficulty: q.difficulty,
        shortAnswer: q.shortAnswer,
        detailedExplanation: q.detailedExplanation,
        humanInterviewAnswer: q.humanInterviewAnswer,
        practicalExample: q.practicalExample,
        codeExampleJson: q.codeExample ?? undefined,
        followUpQuestionsJson: q.followUpQuestions,
        interviewerExpectationsJson: q.interviewerExpectations,
        keyConcepts: q.keyConcepts,
        tags: q.tags,
      },
      create: {
        id: q.id,
        categoryId: q.categoryId,
        topicId: q.topicId ?? null,
        title: q.title,
        difficulty: q.difficulty,
        shortAnswer: q.shortAnswer,
        detailedExplanation: q.detailedExplanation,
        humanInterviewAnswer: q.humanInterviewAnswer,
        practicalExample: q.practicalExample,
        codeExampleJson: q.codeExample ?? undefined,
        followUpQuestionsJson: q.followUpQuestions,
        interviewerExpectationsJson: q.interviewerExpectations,
        keyConcepts: q.keyConcepts,
        tags: q.tags,
      },
    });
  }

  console.log(
    `Done! Seeded ${CATEGORIES_FEED.length} categories and ${ALL_QUESTIONS_FEED.length} interview questions.`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
