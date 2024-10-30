import * as sdk from "@basaldev/blocks-backend-sdk";
import { ObjectId } from 'mongodb';
import { Collections } from "../constant";
import { connectDb } from "../helpers";

export namespace get {
    export async function validate_parent_id(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        console.log("Params: ", context.params);
        if (!context.query['parent_id']) throw new sdk.NBError({
            code: 'invalid_get_request',
            httpCode: 400,
            message: 'parent_id is required',
        });

        return 200;
    }

    export async function validate_subject_id(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.query["subject_id"]) throw new sdk.NBError({
            code: 'invalid_get_request',
            httpCode: 400,
            message: 'subject_id is required',
        });

        return 200;
    }

    export async function validate_child_id(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.query["child_id"]) throw new sdk.NBError({
            code: 'invalid_get_request',
            httpCode: 400,
            message: 'child_id is required',
        });

        return 200;
    }

    export async function validate_date(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["date"]) throw new sdk.NBError({
            code: 'invalid_get_request',
            httpCode: 400,
            message: 'date is required',
        });

        return 200;
    }

    export async function validate_assessments(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["understanding"]) throw new sdk.NBError({
            code: 'invalid_get_request',
            httpCode: 400,
            message: 'understanding is required',
        });
        if (!context.body["participation"]) throw new sdk.NBError({
            code: 'invalid_get_request',
            httpCode: 400,
            message: 'participation is required',
        });
        if (!context.body["creativity"]) throw new sdk.NBError({
            code: 'invalid_get_request',
            httpCode: 400,
            message: 'creativity is required',
        });
        if (!context.body["organization"]) throw new sdk.NBError({
            code: 'invalid_get_request',
            httpCode: 400,
            message: 'organization is required',
        });
        if (!context.body["uself-motivation"]) throw new sdk.NBError({
            code: 'invalid_get_request',
            httpCode: 400,
            message: 'self-motivation is required',
        });
        if (!context.body["communication"]) throw new sdk.NBError({
            code: 'invalid_get_request',
            httpCode: 400,
            message: 'communication is required',
        });
        if (!context.body["completion"]) throw new sdk.NBError({
            code: 'invalid_get_request',
            httpCode: 400,
            message: 'completion is required',
        });

        return 200;
    }
}

export namespace post {
    export async function validate_parent_id(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["parent_id"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'parent_id is required',
        });

        return 200;
    }

    export async function validate_task_id(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["task_id"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'task_id is required',
        });

        let db = await connectDb();

        const task_id: string = context.query['task_id'] as string;
        const tasks = await sdk.mongo.find(logger, db, Collections.taskCollection,
            {
                _id: new ObjectId(task_id)
            }
        );

        if (!tasks.length)
            throw new sdk.NBError({
                code: 'wrong_task_id',
                httpCode: 400,
                message: 'No task with such task_id'
            });
        
        return 200;
    }

    export async function validate_child_name(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["child_first_name"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'child_first_name is required',
        });

        return 200;
    }

    export async function validate_child_bday(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["child_birthday"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'child_birthday is required',
        });

        return 200;
    }

    export async function validate_child_id(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["child_id"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'child_id is required',
        });

        return 200;
    }

    export async function validate_subject_id(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["subject_id"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'subject_id is required',
        });

        return 200;
    }

    export async function validate_subject_list(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["subjects_ids"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'subjects_ids is required',
        });

        return 200;
    }

    export async function validate_date(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["date"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'date is required',
        });

        return 200;
    }

    export async function validate_duration(logger: sdk.Logger, context: sdk.adapter.AdapterHandlerContext) {
        if (!context.body["duration"]) throw new sdk.NBError({
            code: 'invalid_post_request',
            httpCode: 400,
            message: 'duration is required',
        });

        return 200;
    }
}