
// calculate score
import { NextRequest, NextResponse } from "next/server";
export default function handler(req:any,res:any){

    const data = req.body
    if (req.method === 'GET') {
        // Handle GET request

        res.status(200).json({message:"Hello World"});
      }
      else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
