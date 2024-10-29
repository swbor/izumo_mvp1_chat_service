import * as sdk from "@basaldev/blocks-backend-sdk";

export async function connectDb(): Promise<sdk.mongo.Db> {
  console.info("Type of db before singleton: ", typeof globalThis.db);

  if (typeof globalThis.db === 'undefined') {
    globalThis.db = await sdk.mongo.singletonMongoConn(process.env.ADAPTER_DATABASE_URL);
    console.info("Type of db after singleton: ", typeof globalThis.db);
  }
  return globalThis.db;
}

export const getPrompt = ({subjects, reviews}:{subjects: any[], reviews: any[]}) => {
  try {
    const subjectsString = JSON.stringify(subjects);
    const reviewString = JSON.stringify(reviews);

    const prompt = `JSON: We have application that help children to learn and grow up. We need to make a review for current day. 
      Every child has its own subjects (We have this subjects in our database: ${subjectsString}). And today's review is ${reviewString}, which has id of subject and marks from 1 to 6.
      You should take a view of this review and make a review for child. Show me some advices and weaknesses.
    `
    return prompt;
  } catch (error) {
    return ''
  }

}
