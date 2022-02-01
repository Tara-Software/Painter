import { NextApiRequest, NextApiResponse } from "next";

export default function brandHandler(
    req : NextApiRequest,
    res : NextApiResponse
) {
    res.status(200).send("ieieie");
}