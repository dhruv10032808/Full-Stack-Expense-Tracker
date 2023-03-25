const form=document.getElementById('form');
const email=document.getElementById('email')
form.addEventListener('submit',submitHandler);

async function submitHandler(e){
    e.preventDefault();
    console.log(email.value)
    const response=await axios.post('http://localhost:3000/password/forgotpassword',{   
    email:email.value
});
    console.log(response)
}