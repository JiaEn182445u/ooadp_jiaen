function ensureOneCheck(checkBoxName, messageId, submitId) {
	const checkBoxes = document.getElementsByName(checkBoxName);
	let checkCount = 0;
	for (let i=0; i < checkBoxes.length; i++){
		if (checkBoxes[i].checked)
			checkCount++;
	}
	if (checkCount === 0){
		document.getElementById(messageId).style.display = 'block';
		document.getElementById(submitId).disabled = true;
		return false;
	} else {
		document.getElementById(messageId).style.display = 'none';
		document.getElementById(submitId).disabled = false;
		return true;
	}
}

$('#posterUpload').on('change', function(){
	let image = $("#posterUpload")[0].files[0];
	let formdata = new FormData();
	formdata.append('posterUpload', image);
	$.ajax({
	url: '/feedback/upload',
   type: 'POST',
	data: formdata,
	contentType: false,
	processData: false,
	'success':(data) => {
	$('#poster').attr('src', data.file);
	$('#posterURL').attr('value', data.file);// sets posterURL hidden field
	if(data.err){
	$('#posterErr').show();
	$('#posterErr').text(data.err.message);
	} else{
	$('#posterErr').hide();
	}
	}
	});
   });


   $('#posterProfile').on('change', function(){
	let imageprofile = $("#posterProfile")[0].files[0];
	let formdataprofile = new FormData();
	formdataprofile.append('posterProfile', imageprofile);
	$.ajax({
	url: '/cuser/uploadprofilepic',
   type: 'POST',
	dataprofile: formdataprofile,
	contentTypeprofile: false,
	processDataprofile: false,
	'success':(dataprofile) => {
	$('#posterprofilePic').attr('src', dataprofile.file);
	$('#profileURL').attr('value', dataprofile.file);// sets posterURL hidden field
	if(dataprofile.err){
	$('#posterhehe').show();
	$('#posterhehe').text(dataprofile.err.message);
	} else{
	$('#posterhehe').hide();
	}
	}
	});
   });
   
