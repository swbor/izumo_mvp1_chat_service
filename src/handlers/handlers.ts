import * as sdk from "@basaldev/blocks-backend-sdk";
import { connectDb, getFeedbackPrompt, getTaskPrompt } from "../helpers";
import { Collections } from "../constant";
import { ObjectId } from 'mongodb';
import { gptGenerateFeedback, gptGenerateTask } from "../lib";
import { TaskEntity } from "./entities";

export async function get_feedback_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
    data: any,
    message: string,
    status: number
}> {
    try {
        let db = await connectDb();
        const currentDate = new Date();
        //start of the day
        currentDate.setHours(0, 0, 0, 0);
        const id: string = context.query['child_id'] as string;
        const reviews = await sdk.mongo.find(logger, db, Collections.reviewCollection,
            {
                Child: new ObjectId(id),
                createdAt: { $gte: new Date(currentDate) }
            }
        );

        if (!reviews.length) {
            return {
                data: undefined,
                message: "No reviews for today",
                status: 200
            };
        }
        const subjects = await sdk.mongo.aggregate(logger, db, Collections.subjectCollection, [
            {
                $lookup:
                {
                    from: Collections.categoryCollection,
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            }
        ]);

        const criteria = await sdk.mongo.aggregate(
            logger,
            db,
            Collections.criteriaCollection,
            []
        );

        const res = await gptGenerateFeedback(getFeedbackPrompt({subjects: subjects, reviews: reviews, criteria: criteria}));

        return {
            data: res,
            message: "",
            status: 200
        };

    } catch (e) {
        console.error(e);
        return {
            data: undefined,
            message: "",
            status: 500
        };
    }
}

export async function suggest_task_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
    data: any,
    message: string,
    status: number
}> {
    try {
        let db = await connectDb();

        const task_id: string = context.body['task_id'] as string;
        const tasks: TaskEntity[] = await sdk.mongo.find(logger, db, Collections.taskCollection,
            {
                _id: new ObjectId(task_id)
            }
        );

        const children = await sdk.mongo.find(logger, db, Collections.childrenCollection,
            {
                _id: new ObjectId(tasks[0].Child)
            }
        );

        const subjects = await sdk.mongo.aggregate(logger, db, Collections.subjectCollection, [
            {
                $match: {
                    _id: { $eq: new ObjectId(tasks[0].Subject) }
                },
                $lookup:
                {
                    from: Collections.categoryCollection,
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            }
        ]);

        const res = await gptGenerateTask(getTaskPrompt({child: children[0], subject: subjects[0]}));

        await sdk.mongo.updateMany(
            logger,
            db,
            Collections.taskCollection,
            {
                _id: new ObjectId(task_id)
            },
            {
                $set: { description: res['tasks'] }
            }
        );

        return {
            data: res,
            message: "",
            status: 200
        };

    } catch (e) {
        console.error(e);
        return {
            data: undefined,
            message: "",
            status: 500
        };
    }
}

// export async function get_avg_assessments_for_subject_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
//     data: any,
//     status: number
// }> {
//     try {
//         let db = await connectDb();
//         const result = await sdk.mongo.aggregate(logger, db, Collections.reviewCollection, [

//             { $match: { category_id: context.body["id"] } },
//             { $group: { _id: "$Assessment", count: { $avg: "$Assessment" } } }
//         ]);


//         return {
//             data: result,
//             status: 200
//         };
//     } catch (e) {
//         console.error(e);
//         return {
//             data: false,
//             status: 500
//         };
//     }
// }

// export async function get_feedback_for_assessments_handler(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext): Promise<{
//     data: any,
//     status: number
// }> {

//     try {
//         const assessmentObjectEntity: AssessmentsEntity = new AssessmentsEntity(
//             context.body["understanding"],
//             context.body["participation"],
//             context.body["creativity"],
//             context.body["organization"],
//             context.body["self-motivation"],
//             context.body["communication"],
//             context.body["completion"],
//         );

//         //let assessments = context.body["Assessment"];
//         let request = `Provide feedback that a parent can give to a child after a homeschooling class, assessing with the criteria with grade from 0 to 10: 
//         Completion of assignments - ${assessmentObjectEntity.completion},
//         Understanding of concepts - ${assessmentObjectEntity.understanding},
//         Participation - ${assessmentObjectEntity.participation},
//         Creativity and critical thinking - ${assessmentObjectEntity.creativity},
//         Organization - ${assessmentObjectEntity.organization},
//         Communication - ${assessmentObjectEntity.communication},
//         Self-motivation and independence - ${assessmentObjectEntity.self_motivation}.`

//         let db = await connectDb();
//         let result = await callgpt(request);
//         return {
//             data: result,
//             status: 200
//         };
//     } catch (e) {
//         console.error(e);
//         return {
//             data: false,
//             status: 200
//         };
//     }
// }
