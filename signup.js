const form=document.getElementById('form');
const name=document.getElementById('name');
const email=document.getElementById('email');
const password=document.getElementById('password');

form.addEventListener('submit',signup);

function signup(event){
    event.preventDefault();
    const nameValue=event.target.name.value;
    const emailValue=event.target.email.value;
    const passwordValue=event.target.password.value;
    const data={
      name:nameValue,
      email:emailValue,
      password:passwordValue
    }
    axios.post('http://localhost:3000/signup',data).then(res=>{
        console.log(res.data.newUserDetail);
        window.location.href='./login.html'
        if(res.data.newUserDetail.errors){
            alert(`${res.data.newUserDetail.errors[0].message}`)
        }
    })
}
