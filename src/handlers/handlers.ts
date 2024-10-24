import * as sdk from "@basaldev/blocks-backend-sdk";
import { connectDb } from "../helpers";
import { Collections } from "../constant";
import { ObjectId } from 'mongodb';
import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

export const callgpt = async (request: string) => { 

    return await client.chat.completions 
        .create({ 
        messages: [{role: 'user', content: request}], 
        model: 'gpt-4o-2024-08-06', 
        response_format: { 
            type: 'json_schema', 
                json_schema: { 
                name: 'main_output', 
                schema: { 
                    type: 'object', 
                    properties: { 
                    title: { 
                        description: 'feedback', 
                        type: 'string', 
                    }, 
                    description: { 
                        description: 'feedback content', 
                        type: 'string', 
                    }, 
                    rate: { 
                        description: 'price for the offer if was requested', 
                        type: 'number', 
                    }, 
                    }, 
                    required: ['description', 'rate', 'title'], 
                    additionalProperties: false, 
                }, 
                strict: true, 
            }, 
        }, 
        })  
        ?.then(data => { 
        const parsed = JSON.parse(data.choices[0]?.message?.content || '') as { 
            description: string; 
            rate: string; 
            title: string; 
        }; 
        return { 
            description: parsed?.description, 
            rate: String(parsed?.rate), 
            title: parsed?.title, 
        }; 
        }); 
    };

class ChildEntity implements sdk.mongo.BaseMongoEntity {
    constructor(
        public first_name?: string,
        public birthday?: string,
        public Subjects?: Array<string>,
        public Parent?: string,
        public Reviews?: Array<string> | undefined
    ) {
    }
    
    _id: ObjectId; 
    createdAt: Date; 
    delFlg: 0 | 1; 
    id: string; 
    updatedAt: Date; 
}

class ReviewEntity extends sdk.mongo.BaseMongoEntity {
    constructor(
        public date?: string,
        public Subject?: string,
        public Child?: string,
        public hours?: string,
        public Asessment?: Array<string> | undefined
    ) {
        super();
    }
}

class AsessmentsEntity extends sdk.mongo.BaseMongoEntity {
    constructor(
        public understanding?: number,
        public participation?: number,
        public creativity?: number,
        public organization?: number,
        public self_motivation?: number,
        public communication?: number,
        public completion?: number
    ) {
        super();
    }
}

export async function get_asessments_for_day_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
    data: any,
    status: number
}> {
    try {
        let query = {
            Date: context.body["date"]
        };

        let db = await connectDb();
        const result = await sdk.mongo.find(logger, db, Collections.reviewCollection, query);
        return {
            data: result,
            status: 200
        };
        
    } catch (e) {
        console.error(e);
        return {
            data: false,
            status: 500
        };
    }
}

export async function get_avg_asessments_for_subject_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
    data: any,
    status: number
}> {
    try {
        let db = await connectDb();
        const result = await sdk.mongo.aggregate(logger, db, Collections.reviewCollection, [
            
            { $match: { category_id: context.body["id"] } },
            { $group: { _id: "$Asessment", count: { $avg: "$Asessment" } }}
        ]);
           

        return {
            data: result,
            status: 200
        };
    } catch (e) {
        console.error(e);
        return {
            data: false,
            status: 500
        };
    }
}

export async function get_feedback_for_asessments_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
    data: any,
    status: number
}> {

    try {
        const asessmentObjectEntity: AsessmentsEntity = new AsessmentsEntity(
            context.body["understanding"],
            context.body["participation"],
            context.body["creativity"],
            context.body["organization"],
            context.body["self-motivation"],
            context.body["communication"],
            context.body["completion"],
        );
        
        //let asessments = context.body["Asessment"];
        let request = `Provide feedback that a parent can give to a child after a homeschooling class, assessing with the criteria with grade from 0 to 10: 
        Completion of assignments - ${ asessmentObjectEntity.completion },
        Understanding of concepts - ${ asessmentObjectEntity.understanding },
        Participation - ${ asessmentObjectEntity.participation },
        Creativity and critical thinking - ${ asessmentObjectEntity.creativity },
        Organization - ${ asessmentObjectEntity.organization },
        Communication - ${ asessmentObjectEntity.communication },
        Self-motivation and independence - ${ asessmentObjectEntity.self_motivation }.`
        
        let db = await connectDb();
        let result = await callgpt(request);
        return {
            data: result,
            status: 200
        };        
    } catch (e) {
        console.error(e);
        return {
            data: false,
            status: 200
        };
    }
}
