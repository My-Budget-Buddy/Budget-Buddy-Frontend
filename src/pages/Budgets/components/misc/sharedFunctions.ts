import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { timedDelay } from "../../../../util/util";


const dispatch = useAppDispatch();

//fetchCall can be either a PUT or a DELETE. 

const formState = useAppSelector((state) => state.formStatus.status);



export async function sendNewBucket(bucket : SavingsBucketRowProps){
    // Sets buttons to 'waiting', prevent closing
    //send post to endpoint
    //on success, refreshSavingsBuckets();

    //POST to endpoint
    // const repsonse = await fetch(... send bucket)
    console.log("timer started")
    console.log("UPDATING BUCKET", bucket); // <--- This is the bucket to send to the post endpoint

    await timedDelay(1000);

    console.log("timer done")

    //if good: refreshSavingsBuckets
    //else: return error

    // Reallow all user input again
}


export async function sendUpdatedBucket(bucket : SavingsBucketRowProps){
    // Sets buttons to 'waiting', prevent closing
    //send post to endpoint
    //on success, refreshSavingsBuckets();

    //POST to endpoint
    // const repsonse = await fetch(... send bucket)
    console.log("timer started")
    console.log("UPDATING BUCKET", bucket); // <--- This is the bucket to send to the post endpoint

    await timedDelay(1000);

    console.log("timer done")

    //if good: refreshSavingsBuckets
    //else: return error

    // Reallow all user input again
}
  


interface SavingsBucketRowProps {
    data:{
      name: string;
      amount_required: number;
      amount_reserved: number;
      is_currently_reserved: boolean;
    };
  }