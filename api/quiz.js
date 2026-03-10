export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({error:"Method not allowed"})
}

const data = req.body

try {

await fetch("https://api.telegram.org/bot8715209750:AAH4-blEgXPZpeYXii8IeWLX0wdbGWtANQc/sendMessage",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
chat_id:"376719975",
text:"Новый квиз:\n"+JSON.stringify(data,null,2)
})
})

} catch(e) {
console.log(e)
}

res.status(200).json({ok:true})

}
