<?php
	$inData = getRequestInfo();
	
	$name = $inData["name"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare(`
                                UPDATE Contacts
                                SET Name=?, Phone=?, Email=?
                                WHERE UserID=?; 
                            `);
		$stmt->bind_param("siss", $inData["name"], $inData["phone"], $inData["email"], $inData["userId"]);
		$stmt->execute();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>