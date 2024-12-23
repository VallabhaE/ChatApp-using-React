//Syntax of Obj entering into this is 
//{
// --> userName,email,password
//}
export let Users = [{id:0,username:"test",email:"test@t",password:"test"},{id:1,username:"vallu",email:"vallu@t",password:"vallu"}]


export function addUser(username,email,password){
    const userName = Users.some(user => user.username.toLowerCase() === username.toLowerCase());
    const emails = Users.some(user => user.email.toLowerCase() === email.toLowerCase());
    if(userName) return 1;
    if(emails) return 2;

    Users.push({id:Users.length,username:username.toLowerCase(),email:email,password:password})
    return 0
}

export function checkUser(username, password) {
    const user = Users.find(user => 
        user.username.toLowerCase() === username.toLowerCase() &&
        user.password === password
    );

    return user || undefined;  // Returns the user if found, otherwise undefined
}