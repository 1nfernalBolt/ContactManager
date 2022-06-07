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
		//document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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
	let email = document.getElementById("contactemail").value;
	document.getElementById("contactAddResult").innerHTML = "";

	let full = firstName.concat(" ");
	let fullName = full.concat(secondName);

	let tmp = {name:fullName, phone:phonenumber, userId:userId, email:email};
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
	// Get search criteria from box
	let srch = document.getElementById("searchText").value;
	
	if (srch.length > 0) {
		// Send stuff to the API
		let tmp = {search:srch,userId:userId};
		let jsonPayload = JSON.stringify( tmp );

		let url = urlBase + '/SearchContacts.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		// Try to get stuff back from the API
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					// Reset list
					document.getElementById("contactList").innerHTML = "";
	
					let currentContact = "";
					let nameString = "";
					let phoneString = "";
					let emailString = "";

					let list = document.getElementById("searchContactResults");
					list.innerHTML = "";

					// Get return JSON from API
					let jsonObject = JSON.parse( xhr.responseText );

					// If the API return is empty, do nothing; otherwise:
					if (jsonObject.results != null) {	

						let rowEntry = null;
						let colEntry1 = null;
						let colEntry2 = null;
						let colEntry3 = null;
						let colEntry4 = null;
						let colEntry5 = null;

						// Loop through each JSON object
						for( let i=0; i<jsonObject.results.length; i++ )
						{
							// Get a single JSON object from array
							currentContact = jsonObject.results[i];
							
							// Populate the arrays with info from the JSON
							nameString = currentContact.Name;
							phoneString = currentContact.Phone;
							emailString = currentContact.Email;

							

							rowEntry = document.createElement("tr");
							rowEntry.setAttribute("style", "border-bottom:2px dashed plum");

							colEntry1 = document.createElement("td");
							colEntry1.innerHTML = nameString;
							colEntry1.setAttribute("style", "width:30%");

							colEntry2 = document.createElement("td");
							colEntry2.innerHTML = emailString;
							colEntry2.setAttribute("style", "width:40%");

							colEntry3 = document.createElement("td");
							colEntry3.innerHTML = phoneString;
							colEntry3.setAttribute("style", "width:20%");

							/* BUTTON ENTRY SPOT
							colEntry4 is the edit button, and colEntry5 is the delete button
							*/
							colEntry4 = document.createElement("td");
							colEntry4.innerHTML = "EDIT";
							colEntry4.setAttribute("style", "width:5%");

							colEntry5 = document.createElement("td");
							colEntry5.innerHTML = "DELETE";
							colEntry5.setAttribute("style", "width:5%");
							/* END BUTTON ENTRY SPOT */

							rowEntry.appendChild(colEntry1);
							rowEntry.appendChild(colEntry2);
							rowEntry.appendChild(colEntry3);
							rowEntry.appendChild(colEntry4);
							rowEntry.appendChild(colEntry5);
		
							list.appendChild(rowEntry)												
						}
					}
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("contactList").innerHTML = err.message;
		}
	} else {
		let list = document.getElementById("searchContactResults");
		list.innerHTML = "";
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
		document.getElementById("registerResult").innerHTML = "*Required: First Name";
		return

	}

	if(LastName == ""){
		document.getElementById("registerResult").innerHTML = "*Required: Last Name";
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
	
	let tmp = {firstName:FirstName, lastName:LastName, login:LoginId, password:hash};
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

