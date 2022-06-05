const urlBase = 'http://www.projectgroup21.com/LAMPAPI'; // this should be our servers url
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
function doLogin()
{
	//console.log("This happens")
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("password").value;

	if(login == ""){
		document.getElementById("loginResult").innerHTML = "Required: Username or email";
		return

	}
	if(password == ""){
		document.getElementById("loginResult").innerHTML = "Required: Password!";
		return

	}
	
	var hash = md5( password );
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:hash};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "dashboard.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let firstName = document.getElementById("firstName").value;
	let secondName = document.getElementById("secondName").value;
	let phonenumber = document.getElementById("pnoneNumber").value;
	
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {firstName:firstName, secondName:secondName, phonenumber:phonenumber, userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Success: Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactList").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactList").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactList").innerHTML = err.message;
	}
	
}

function RegisterNewUser()
{
	var FirstName = document.getElementById("FirstName").value;
	var LastName = document.getElementById("LastName").value;
	var LoginId = document.getElementById("emailReg").value;
	var password = document.getElementById("NewUserPassword").value;
	var Cpassword = document.getElementById("CNewUserPassword").value;

	//input validation
	if(FirstName == ""){
		document.getElementById("RegisterResult").innerHTML = "*Required: First Name";
		return

	}

	if(LastName == ""){
		document.getElementById("RegisterResult").innerHTML = "*Required: Last Name";
		return

	}

	//Login validation
	if(LoginId == ""){
		document.getElementById("RegisterResult").innerHTML = "*Required: Username or Login ID";
		return

	}
	
	//check if the confirmation password matches the first password here. 
	if(password == ""){
		document.getElementById("RegisterResult").innerHTML = "*Password cannot be empty";
		return

	}
	if(password.length < 6){
		document.getElementById("RegisterResult").innerHTML = "*Password must be at least 6 characters long";
		return
	}
	if(password != Cpassword){
		document.getElementById("RegisterResult").innerHTML = "*Passwords Do not Match";
		return
	}
 
 	document.getElementById("RegisterResult").innerHTML = "";
	var hash = md5(password);
	
	let tmp = {userId:userId, FirstName:FirstName, LastName:LastName, LoginId:LoginId, Password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	//name the php file name == AddUsers.php
	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("RegisterResult").innerHTML = "Registration Was Successful!";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("RegisterResult").innerHTML = err.message;
	}
}

function deleteContact()
{
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
  	var pnoneNumber = document.getElementById("pnoneNumber").value;

  	let tmp = {firstName:firstName,firstName:firstName,firstName:firstName, userId:userId};
	let jsonPayload = JSON.stringify( tmp );


	var url = urlBase + '/DeleteContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactUpdateResult").innerHTML = "Contact has been deleted";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactUpdateResult").innerHTML = err.message;
	}

}

