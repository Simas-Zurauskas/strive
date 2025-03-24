import { NodeFunctionOutput } from '../types';
import LessonContentModel from '@/lib/mongo/models/LessonContent';
import { genHashId, getResources } from '../util';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { initVectorStore } from '@/lib/ai/stores';

const textSplitter = RecursiveCharacterTextSplitter.fromLanguage('markdown', {
  chunkSize: 512,
  chunkOverlap: 40,
});

export const genVectors: NodeFunctionOutput = async (state) => {
  console.log('__NODE__ genVectors');

  try {
    const { targetLesson, targetModule } = await getResources({
      uxId: state.uxId,
      moduleId: state.moduleId,
      lessonId: state.lessonId,
    });

    const lessonContent = await LessonContentModel.findById(targetLesson.content);

    if (!lessonContent) {
      return {};
    }

    const vectorStore = await initVectorStore();

    if (lessonContent.vectorIds.length) {
      await vectorStore.delete({
        ids: lessonContent.vectorIds,
      });
    }

    const text = await textSplitter.splitText(lessonContent.md);
    const splitDocuments = await textSplitter.createDocuments(text);
    const rdyDocs = splitDocuments.map((el) => {
      return {
        pageContent: `Module: ${targetModule.title}\nLesson: ${targetLesson.title}\n\n${el.pageContent}`,
        metadata: { uxId: state.uxId },
      };
    });

    const vectorIds = rdyDocs.map((el) => genHashId(el.pageContent));

    await vectorStore.addDocuments(rdyDocs, {
      ids: vectorIds,
    });

    lessonContent.vectorIds = vectorIds;
    await lessonContent.save();

    return {};
  } catch (error) {
    console.error('Error in saveToDbNode:', error);
    return {};
  }
};
