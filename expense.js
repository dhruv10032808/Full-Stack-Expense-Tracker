var form=document.getElementById('form');
var list=document.getElementById('list');
var expense=document.getElementById('expense');
var description=document.getElementById('description');
var category=document.getElementById('Category');
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
   axios.post('http://localhost:3000/add-expense',obj)
   .then((res)=>{
    document.getElementById('expense').value="";
    document.getElementById('description').value="";
    document.getElementById('Category').value="";
    console.log(res)
    onsubmit(res.data.newExpenseDetail);
   })
   .catch((err)=>{
    document.body.innerHTML=document.body.innerHTML+`<h4>Something went wrong</h4>`
})
}

window.addEventListener('DOMContentLoaded', () => {
    axios.get('http://localhost:3000/get-expense')
        .then((res)=>{
            for(var i=0;i<res.data.newExpenseDetail.length;i++){
                onsubmit(res.data.newExpenseDetail[i]);
            }
            console.log(res)
        })
        .catch((err)=>console.log(err));

     })

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
    axios.delete(`http://localhost:3000/delete-expense/${userId}`)
    .then((response)=>{
    const curr=document.getElementById(userId);
    list.removeChild(curr);
    })
    .catch((err)=>console.log(err));
}