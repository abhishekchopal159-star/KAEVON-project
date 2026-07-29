type Bucket={count:number;resetAt:number};
const buckets=new Map<string,Bucket>();

// Client-side UX throttle only. A production API must enforce the same policy
// at its trusted server/edge boundary; this helper is never an authorization control.
export function consumeClientAction(key:string,limit=5,windowMs=60_000){const now=Date.now();const current=buckets.get(key);if(!current||current.resetAt<=now){buckets.set(key,{count:1,resetAt:now+windowMs});return {allowed:true,retryAfterMs:0};}if(current.count>=limit)return {allowed:false,retryAfterMs:current.resetAt-now};current.count+=1;return {allowed:true,retryAfterMs:0};}
