
// calculate score
import {Formidable} from 'formidable';
import { NextRequest, NextResponse } from "next/server";

type FormValues<T> = {
    tl: T;
    htpp: T;
    hcp: T;
    hsl: T;
    lls: T;
    br: T;
    mvp: T;
    win: T;
    ko: T;
    cap: T;
    champ: T;
};


function calculateScore(fields:FormValues<string[]>) {
    const newFields:FormValues<number> = {
        tl:0,
        htpp:0,
        hcp:0,
        hsl:0,
        lls:0,
        br:0,
        mvp:0,
        win:0,
        ko:0,
        cap:0,
        champ:0,
    }
    Object.keys(fields).forEach((key)=>{
        newFields[key as keyof FormValues<string>] = parseInt(fields[key as keyof FormValues<string[]>][0],10)
    })


    console.log(newFields)

    let {tl, htpp, hcp, hsl, lls, br, mvp, win, ko, cap, champ} = newFields
    let mvp_win = mvp / win;

    // Normalizing tl
    if (tl <= 50000 && tl > 10000) {
        tl *= 0.8;
    } else if (tl <= 10000 && tl > 5000) {
        tl *= 0.6;
    } else if (tl <= 5000 && tl > 1000) {
        tl *= 0.4;
    } else if (tl <= 1000 && tl > 0) {
        tl *= 0.2;
    }

    // Normalizing htpp
    if (htpp <= 55000 && htpp > 50000) {
        htpp *= 0.75;
    } else if (htpp <= 50000 && htpp > 40000) {
        htpp *= 0.5;
    } else if (htpp <= 40000) {
        htpp *= 0.25;
    }

    // Normalizing hcp
    if (hcp <= 11000 && hcp > 10000) {
        hcp *= 0.75;
    } else if (hcp <= 10000 && hcp > 8000) {
        hcp *= 0.5;
    } else if (hcp <= 8000) {
        hcp *= 0.25;
    }

    // Normalizing hsl
    if (hsl <= 100000 && hsl > 50000) {
        hsl *= 0.9;
    } else if (hsl <= 50000 && hsl > 10000) {
        hsl *= 0.75;
    } else if (hsl <= 10000 && hsl > 1000) {
        hsl *= 0.5;
    } else if (hsl <= 1000) {
        hsl *= 0.3;
    }

    // Normalizing lls
    if (lls <= 100000 && lls > 50000) {
        lls *= 0.9;
    } else if (lls <= 50000 && lls > 10000) {
        lls *= 0.75;
    } else if (lls <= 10000 && lls > 1000) {
        lls *= 0.5;
    } else if (lls <= 1000) {
        lls *= 0.3;
    }

    // Normalizing br
    let net_br;
    if (br == 0) {
        net_br = -100;
    } else {
        net_br = 10000 - br;
    }

    // Normalizing ko
    if (ko <= 50000 && ko > 10000) {
        ko *= 0.8;
    } else if (ko <= 10000 && ko > 5000) {
        ko *= 0.6;
    } else if (ko <= 5000 && ko > 1000) {
        ko *= 0.4;
    } else if (ko <= 1000) {
        ko *= 0.2;
    }

    // Normalizing cap
    if (cap <= 50000 && cap > 10000) {
        cap *= 0.8;
    } else if (cap <= 10000 && cap > 5000) {
        cap *= 0.6;
    } else if (cap <= 5000 && cap > 1000) {
        cap *= 0.4;
    } else if (cap <= 1000) {
        cap *= 0.2;
    }

    let s = ((tl * 0.1 + htpp * 0.12 + hcp * 0.08) + 
             (hsl * 0.1 + lls * 0.15 + net_br + mvp_win * 1000 * 0.18 + 
              ko * 0.1 + cap * 0.09));
    s = s * 75000;

    let k;
    if (champ == 1) {
        k = 500000000;
    } else if (champ >= 2 && champ <= 10) {
        k = 100000000;
    } else if (champ >= 11 && champ <= 100) {
        k = 50000000;
    } else if (champ == 0) {
        k = 500000;
    } else {
        k = 1000000;
    }

    return Math.floor(s + k);
}


// make the tailing 6 integer 0

function convertLastSixDigitsToZero(number:number) {
    // if (number.toString().length !== 10) {
    //     return "Please enter a 10-digit number.";
    // }

    // Convert the number to a string, take the first 4 digits, and append six zeros.
    let result = Math.round(number/10000)*10000

    return result;
}

export const config = {
    api: {
      bodyParser: false,
    },
  };

export default function handler(req:any,res:any){

    if (req.method === 'POST') {
        // Handle GET request
        const form = new Formidable();
        form.parse(req,(err, fields)=>{
            if(err){
                res.status(500).json({ message: 'Error parsing form data' });
                return;
            }


            const score = calculateScore(fields as unknown as FormValues<string[]>)
    
            const answer = convertLastSixDigitsToZero(score)
    
    
            res.status(200).json({data:{score: answer}, message:"Score Successful"});

        })

      }
      else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
