import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
    tl: string;
    htpp: string;
    hcp: string;
    hsl: string;
    lls: string;
    br: string;
    mvp: string;
    win: string;
    ko: string;
    cap: string;
    champ: string;
};

export default function BountyRush() {
    const [count, setCount] = useState(0);
    const { register, handleSubmit } = useForm<FormValues>();

    const getter = async (data: FormData) => {
        const fetchResponse = await fetch(`/api/bounty`, {
            method: "POST",
            headers: {},
            body: data,
        });
        const response = await fetchResponse.json();
        return response;
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const form = new FormData();
        Object.keys(data).map((key) => {
            console.log("Hello",data[key as keyof FormValues])
            form.append(key, data[key as keyof FormValues]);
        });

        const response = await getter(form);
        console.log(response)

        setCount(response.data?.score || 0);
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <p>
                    <label>Total Likes</label>
                    <input type="number" {...register("tl")} />
                </p>
                <p>
                    <label>Highest Party Power</label>

                    <input type="number" {...register("htpp")} />
                </p>

                <p>
                    <label>Highest Character Power </label>

                    <input type="number" {...register("hcp")} />
                </p>
                <p>
                    <label>League Score</label>

                    <input type="number" {...register("hsl")} />
                </p>
                <p>
                    <label>Last League Score</label>

                    <input type="number" {...register("lls")} />
                </p>
                <p>
                    <label>Best rank</label>

                    <input type="number" {...register("br")} />
                </p>
                <p>
                    <label>MVP</label>

                    <input type="number" {...register("mvp")} />
                </p>
                <p>
                    <label>Total Wins</label>

                    <input type="number" {...register("win")} />
                </p>
                <p>
                    <label>KO</label>

                    <input type="number" {...register("ko")} />
                </p>
                <p>
                    <label>Time Cap</label>

                    <input type="number" {...register("cap")} />
                </p>
                <p>
                    <label>Championship Rank</label>

                    <input type="number" {...register("champ")} />
                </p>
                <button type="submit">Submit</button>
            </form>

            <div>Counter Set: {count}</div>
        </div>
    );
}
