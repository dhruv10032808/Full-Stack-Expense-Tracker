const form=document.getElementById('form');
const email=document.getElementById('email');
const password=document.getElementById('password');
const forgotPassword=document.getElementById('forgotPassword')

form.addEventListener('submit',login);

function login(event){
    event.preventDefault();
    const emailValue=event.target.email.value;
    const passwordValue=event.target.password.value;
    const data={
      email:emailValue,
      password:passwordValue
    }
    axios.post('http://localhost:3000/login',data).then(res=>{
        alert(res.data.message);
        localStorage.setItem('token',res.data.token);
        window.location.href='./expense.html';
    }).catch(err=>{
        document.body.innerHTML+=`<div style="color:red">${err.message} </div>`
    })
}

forgotPassword.addEventListener('click',forgotHandler);

function forgotHandler(){
    window.location.href='./forgot-password.html'
}