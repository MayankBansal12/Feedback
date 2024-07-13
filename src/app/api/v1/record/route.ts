// api/v1/record

import isSecretValid from "@/helpers/validSecret";
import dbConnect from "@/lib/dbConnect";
import RecordModel from "@/models/Record";
import { recordSchema } from "@/schemas/recordSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
    await dbConnect()

    let response: ApiResponse;
    response = await isSecretValid(req)

    if (!response.success) {
        return new Response(JSON.stringify(response), { status: response.status })
    }

    try {
        const searchParams = req.nextUrl.searchParams
        const formId = searchParams.get('formId')
        const records = await RecordModel.find({ formId }).sort({ createdDate: -1 })

        response = { success: true, status: 200, message: "success creating a project", data: records };
        return new Response(JSON.stringify(response), { status: response.status })
    } catch (error) {
        if (error instanceof z.ZodError) {
            response = { success: false, status: 400, message: error.errors[0].message };
        } else {
            console.error("Error creating a project!", error);
            response = { success: false, status: 400, message: "Error creating a project!" };
        }
        return new Response(JSON.stringify(response), { status: response.status })
    }
}

export async function POST(req: Request) {
    await dbConnect()

    let response: ApiResponse;
    response = await isSecretValid(req)

    if (!response.success) {
        return new Response(JSON.stringify(response), { status: response.status })
    }

    try {
        const reqData = await req.json()
        const { text, rating, formId } = recordSchema.parse(reqData)

        const newRecord = new RecordModel({ text, rating, formId })
        newRecord.save()

        response = { success: true, status: 200, message: "Submitted the record!", data: newRecord };
        return new Response(JSON.stringify(response), { status: response.status })
    } catch (error) {
        if (error instanceof z.ZodError) {
            response = { success: false, status: 400, message: error.errors[0].message };
        } else {
            console.error("Error creating a project!", error);
            response = { success: false, status: 400, message: "Error creating a record!" };
        }
        return new Response(JSON.stringify(response), { status: response.status })
    }
}