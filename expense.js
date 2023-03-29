var form=document.getElementById('form');
var list=document.getElementById('list');
var expense=document.getElementById('expense');
var description=document.getElementById('description');
var category=document.getElementById('Category');
const token=localStorage.getItem('token')
form.addEventListener('submit',local)
function local(e){
    e.preventDefault();
    var expense=e.target.expense.value;
    var description=e.target.description.value;
    var category=e.target.category.value;
   let obj={
    expense,
    description,
    category
   };
   axios.post('http://localhost:3000/add-expense',obj,{headers:{'Authorization':token}})
   .then((res)=>{
    document.getElementById('expense').value="";
    document.getElementById('description').value="";
    document.getElementById('Category').value="";
    console.log(res)
    onsubmit(res.data.newExpenseDetail);
   })
   .catch((err)=>{
    document.body.innerHTML=document.body.innerHTML+`<span>Something went wrong</span>`
})
}

window.addEventListener('DOMContentLoaded',getexpense)
function getexpense(){
    list.innerHTML='';
    const select=localStorage.getItem('select');
    axios.get(`http://localhost:3000/get-expense?limit=${select}`,{headers:{'Authorization':token}})
        .then((res)=>{
            createpagination(res.data.pages)
            console.log(res.data.ispremiumuser)
            for(var i=0;i<res.data.newExpenseDetail.length;i++){
                onsubmit(res.data.newExpenseDetail[i]);
            }
            // if(res.data.ispremiumuser){
            //     document.body.innerHTML+=`<span>You are a premium user</span><button id="leaderboard" onclick="${getleaderboard}" class="btn btn-primary" style="margin-left:10px">Show Leaderboard</button>`
            //  }
            console.log(res)
        })
        .catch((err)=>console.log(err));
     }

window.addEventListener('DOMContentLoaded',()=>{
    axios.get(`http://localhost:3000/get-expense`,{headers:{'Authorization':token}})
    .then((res)=>{
        if(res.data.ispremiumuser){
            document.getElementById('premium').innerHTML+=`<span>You are a premium user</span><button id="leaderboard" onclick="getleaderboard()" class="btn btn-primary" style="margin-left:10px">Show Leaderboard</button><button onclick="getReport()" class="btn btn-primary" style="margin-left:10px">Generate report</button>`
         }
         localStorage.setItem('premium',res.data.ispremiumuser)
        console.log(res)
    })
    .catch((err)=>console.log(err));
})

window.addEventListener('DOMContentLoaded',getrecent);
async function getrecent(){
    const ispremiumuser=localStorage.getItem('premium');
    try{
        if(ispremiumuser){
    let response=await axios.get('http://localhost:3000/user/recent-download',{headers:{"Authorization":token}})
    console.log(response.data.data[0]);
    for (let i = 0; i < response.data.data.length; i++){

    viewrecent(response.data.data[i]);


    } 
}else{
    alert('You are not a premium member')
}  
    }
    catch(err){
        console.log(err)
    };
}

   function viewrecent(data){
    console.log(data);
    const childhtml=`<li id=${data.id}><a href="${data.fileURL}">Download</a> ${data.createdAt}  `;

    const parentnode=document.getElementById('recent-download');
    console.log(parentnode);
    parentnode.innerHTML=parentnode.innerHTML+childhtml;


}

function onsubmit(user){
    var btn=document.createElement('button');
    btn.appendChild(document.createTextNode('Edit Expense'));
    var btn2=document.createElement('button');
    btn2.appendChild(document.createTextNode('Delete Expense'));
    btn2.setAttribute('onclick',"del('"+user.id+"')");
    console.log(btn2);
    btn.setAttribute('onclick',"edit('"+user.id+"','"+user.expense+"','"+user.description+"','"+user.category+"')");
    var li=document.createElement('li');
    li.id=user.id;
    console.log(li);
    li.appendChild(document.createTextNode(user.expense +"-"+ user.description+"-"+user.category));
    li.appendChild(btn) ;
    li.appendChild(btn2) ;
    list.appendChild(li);
}
function edit(userId,exp,desc,cat){
        expense.value=exp;
        description.value=desc;
        category.value=cat;
        del(userId);
}

function del(userId){ 
    axios.delete(`http://localhost:3000/delete-expense/${userId}`,{headers:{'Authorization':token}})
    .then((response)=>{
    const curr=document.getElementById(userId);
    list.removeChild(curr);
    getexpense();
    })
    .catch((err)=>console.log(err));
}

const rzp=document.getElementById('rzp-button1');
rzp.addEventListener('click',premium);

async function premium(e){
   const response=await axios.get('http://localhost:3000/premium-membership',{headers:{'Authorization':token}})
   console.log(response);
   var options={
    "key":response.data.key_id,
    "order_id":response.data.order.id,
    //to handle success of payment
    "handler":async function (response){
     const res=await axios.post('http://localhost:3000/update-transaction-status',{
        order_id:options.order_id,
        payment_id:response.razorpay_payment_id
     },{headers:{'Authorization':token}})

     alert('You are a premium user now');
     console.log(res.data.ispremiumuser)
     if(res.data.ispremiumuser){
        document.getElementById('premium').innerHTML+=`<span>You are a premium user</span><button id="leaderboard" onclick="getleaderboard()" class="btn btn-primary" style="margin-left:10px">Show Leaderboard</button><button onclick="getReport()" class="btn btn-primary" style="margin-left:10px">Generate report<button>`
     }
    }
   }
   const rzp1=new Razorpay(options);
   rzp1.open();
   e.preventDefault();

   rzp1.on('payment.failed',async function(response){
    await axios.post('http://localhost:3000/update-incomplete-transaction-status',{
        order_id:options.order_id,
     },{headers:{'Authorization':token}})
    console.log(response);
    alert('Something went wrong');
   })
}

function getleaderboard(){
    console.log('clicked');
    axios.get('http://localhost:3000/premium/showLeaderboard',{headers:{'Authorization':token}}).then(res=>{
        for(var i=0;i<res.data.length;i++){
            leaderboard(res.data[i]);
        }
    })
}

function leaderboard(data){
    const li=document.createElement('li');
    li.appendChild(document.createTextNode(`Name-${data.name} Total Expense:${data.totalExpense}`));
    document.getElementById('leaderboard-list').appendChild(li)
}

function getReport(){
    window.location.href='./report.html'
}

function download(){
    const ispremiumuser=localStorage.getItem('premium');
    if(ispremiumuser==='true'){
    axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 201){
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        }
    })
}else{
    alert('You are not a premium member!')
}
}

function createpagination(pages){
    document.querySelector('#pagination').innerHTML="";
    let childhtml="";
    for(var i=1;i<=pages;i++){
         childhtml+=`<a class="mx-2" id="page=${i}" >${i}</a>`;  
    }
    const parentnode=document.querySelector('#pagination');
    parentnode.innerHTML=parentnode.innerHTML+childhtml;
}
document.querySelector('#pagination').addEventListener('click',getexpensepage);
async function getexpensepage(e){
    list.innerHTML="";
    try{
    let response=await axios.get(`http://localhost:3000/get-expense?${e.target.id}`,{headers:{"Authorization":token}})
    for (let i = 0; i < response.data.newExpenseDetail.length; i++){
        onsubmit(response.data.newExpenseDetail[i]);
    }   
    }
    catch(err){
        console.log(err)
    }; 
}
document.querySelector('#select').addEventListener('change',(e)=>{
    localStorage.setItem('select',e.target.value);
    getexpense();
})