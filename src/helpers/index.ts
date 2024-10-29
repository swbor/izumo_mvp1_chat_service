import * as sdk from "@basaldev/blocks-backend-sdk";

export async function connectDb(): Promise<sdk.mongo.Db> {
  console.info("Type of db before singleton: ", typeof globalThis.db);

  if (typeof globalThis.db === 'undefined') {
    globalThis.db = await sdk.mongo.singletonMongoConn(process.env.ADAPTER_DATABASE_URL);
    console.info("Type of db after singleton: ", typeof globalThis.db);
  }
  return globalThis.db;
}

export const getPrompt = ({subjects, reviews, criteria}:{subjects: any[], reviews: any[], criteria: any[]}) => {
  try {
    const subjectsString = JSON.stringify(subjects);
    const reviewString = JSON.stringify(reviews);
    const criteriaString = JSON.stringify(criteria);

    const prompt = `JSON: Generate feedback for several homeschooling classes that a parent can give to a child at the end of day. 
      Here is criteria that is used for assessment: ${criteriaString}. Here is a list of reviews for todays lessons with grades for provided criteria: ${reviewString}. 
      Subjects that referenced in reviews: ${subjectsString}). Provide positive reinforcement, areas to improve and advice on improvement.
    `
    return prompt;
  } catch (error) {
    return ''
  }

}