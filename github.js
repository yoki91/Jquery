var API_BASE_URL = "https://api.github.com";
var USERNAME;
var PASSWORD;
var numberP=1;



/*
Details about repository of GitHub API 
https://developer.github.com/v3/repos/
*/
$("#login").click(function(e)
	{
		e.preventDefault();
		getuserpass($("#username").val(),$("#pass").val());
		
		
	});

$("#button_get_repos").click(function(e) 
{
	e.preventDefault();
	getRepos();
});

$("#button_get_repo").click(function(e) {
	e.preventDefault();
	getRepo($("#repository_name").val());
});

$("#button_get_repo_to_edit").click(function(e) {
	e.preventDefault();
	getRepoToEdit($("#repository_name_get_to_edit").val());
});


$("#button_edit_repo").click(function(e) {
	e.preventDefault();

    var newRepo = new Object();
	newRepo.name = $("#repository_name_to_edit").val()
	newRepo.description = $("#description_to_edit").val()	
	updateRepo(newRepo);

});


$("#button_to_create").click(function(e) 
{
	e.preventDefault();

    var newRepo = new Object();
	newRepo.name = $("#repository_name_to_create").val();
	newRepo.description = $("#description_to_create").val();
 	newRepo.homepage = "https://github.com";
 	newRepo.private = false;
	newRepo.has_issues = true;
	newRepo.has_wiki = true;
	newRepo.has_downloads = true;
	createRepo(newRepo);

});




$("#button_to_delete").click(function(e)
{
	e.preventDefault();
	deleteRepos($("#repository_name_to_delete").val());
});


$("#button_get_repos_paginado").click(function(e)
{
	e.preventDefault();
	getRepos_Paginado();
});


$("#get_email").click(function(e)
{
	e.preventDefault();
	get_email();
});

$("#button_get_previous_repos").click(function(e)
{
	e.preventDefault();
	get_previousRpos(numberP=numberP-1);
});


$("#button_get_next_repos").click(function(e)
{
	e.preventDefault();
	get_nextRepos(numberP=numberP+1);
});






function getuserpass(user,pass)
{
	USERNAME=user;
	PASSWORD=pass;
	$.ajaxSetup
		({
	        headers: { 'Authorization': "Basic "+ btoa(USERNAME+':'+PASSWORD)}
         });

}

function getRepos() 
{
	var url = API_BASE_URL + '/users/' + USERNAME + '/repos';
	$("#repos_result").text('');
	
	$.ajax
	({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) 
	{
				var repos = data;
				
				$.each(repos, function(i, v) 
				{
					var repo = v;

					$('<h4> Name: ' + repo.name + '</h4>').appendTo($('#repos_result'));
					$('<p>').appendTo($('#repos_result'));	
					$('<strong> ID: </strong> ' + repo.id + '<br>').appendTo($('#repos_result'));
					$('<strong> URL: </strong> ' + repo.html_url + '<br>').appendTo($('#repos_result'));
					$('<strong> Description: </strong> ' + repo.description + '<br>').appendTo($('#repos_result'));
					$('</p>').appendTo($('#repos_result'));
				});
				

	}).fail(function() {
		$("#repos_result").text("No repositories.");
	});

}



function getRepo(repository_name) 
{
	var url = API_BASE_URL + '/repos/' + USERNAME + '/' + repository_name;
	$("#get_repo_result").text('');

	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) 
	{

				var repo = data;

				$("#get_repo_result").text('');
				$('<h4> Name: ' + repo.name + '</h4>').appendTo($('#get_repo_result'));
				$('<p>').appendTo($('#get_repo_result'));	
				$('<strong> ID: </strong> ' + repo.id + '<br>').appendTo($('#get_repo_result'));
				$('<strong> Full name: </strong> ' + repo.full_name + '<br>').appendTo($('#get_repo_result'));
				$('<strong> Private: </strong> ' + repo.priate + '<br>').appendTo($('#get_repo_result'));
				$('<strong> URL: </strong> ' + repo.html_url + '<br>').appendTo($('#get_repo_result'));
				$('<strong> Description: </strong> ' + repo.description + '<br>').appendTo($('#get_repo_result'));
				$('</p>').appendTo($('#get_repo_result'));

			}).fail(function() 
			{
				$('<div class="alert alert-danger"> <strong>Oh!</strong> Repository not found </div>').appendTo($("#get_repo_result"));
	        });

}

function getRepoToEdit(repository_name) 
{
	var url = API_BASE_URL + '/repos/' + USERNAME + '/' + repository_name;
	$("#update_result").text('');

	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) 
	{
		
				var repo = data;
				$("#update_result").text('');
				$("#repository_name_to_edit").val(repo.name);
				$("#description_to_edit").val(repo.description);

	}).fail(function() 
	{
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Repository not found </div>').appendTo($("#update_result"));
	});

}

function updateRepo(repository) 
{
	var url = API_BASE_URL + '/repos/' + USERNAME + '/' + repository.name;
	var data = JSON.stringify(repository);

	$("#update_result").text('');

	$.ajax
	({
		url : url,
		type : 'PATCH',
		crossDomain : true,
		dataType : 'json',
		data : data,
		statusCode: 
		{
    		404: function() {$('<div class="alert alert-danger"> <strong>Oh!</strong> Page not found </div>').appendTo($("#update_result"));}
    	}
	}).done(function(data, status, jqxhr) 
	{
		$('<div class="alert alert-success"> <strong>Ok!</strong> Repository Updated</div>').appendTo($("#update_result"));				
  	}).fail(function() 
  	{
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Error </div>').appendTo($("#update_result"));
	});

}


function createRepo(repository) 
{
	var url = API_BASE_URL + '/user/repos';
	var data = JSON.stringify(repository);

	$("#create_result").text('');

	$.ajax
	({
		url : url,
		type : 'POST',
		crossDomain : true,
		dataType : 'json',
		data : data,
	}).done(function(data, status, jqxhr) 
	{
		$('<div class="alert alert-success"> <strong>Ok!</strong> Repository Created</div>').appendTo($("#create_result"));				
  	}).fail(function() 
  	{
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Error </div>').appendTo($("#create_result"));
	});
  }




function deleteRepos(repository_name)
{
	
    var url =API_BASE_URL + '/repos/' + USERNAME + '/' + repository_name;


	$("#delete_result").text('');

	$.ajax
	({
		url: url,
		type: 'DELETE',
		crossDomain: true,
		dataType:'json',
	}).done(function(data,status,jqxhr)
	{
		$('<div class="alert alert-success"> <strong>Ok!</strong> Repository deleted</div>').appendTo($("#delete_result"));	

	}).fail(function()
	{
		$('<div class="alert alert-sucess"> <strong>Ok!</strong> Repository deleted </div>').appendTo($("#delete_result"));
	});

}


function getRepos_Paginado()
{
	var url = API_BASE_URL+'/users/'+USERNAME +'/repos?page='+numberP+'&per_page=3';
	console.log(url);
	$("#repos_result").text('');
	$("#page").text(numberP);
	
	$.ajax
	({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) 
	{
				var repos = data;
				/*//var link = jqxhr.getResponseHeader('Link');
				//var valor=JSON.parse(jqxhr.getAllResponseHeaders());
				//var enlace =JSON.parse(valor);
				//var enlace=$.parseJSON(valor);
				var valor=jqxhr.getAllResponseHeaders();
				//var valorJ=JSON.parse(valor);
				console.log(valor);
				//console.log(valorJ);
				console.log(valor.Link);*/
				$.each(repos, function(i, v) 
				{
					var repo = v;

                    //$('<strong> Link: </strong> ' + link + '<br>').appendTo($('#repos_result'));
                    //$('<h4> Name: ' + valor + '</h4>').appendTo($('#repos_result'));
					$('<h4> Name: ' + repo.name + '</h4>').appendTo($('#repos_result'));
					$('<p>').appendTo($('#repos_result'));	
					$('<strong> ID: </strong> ' + repo.id + '<br>').appendTo($('#repos_result'));
					$('<strong> URL: </strong> ' + repo.html_url + '<br>').appendTo($('#repos_result'));
					$('<strong> Description: </strong> ' + repo.description + '<br>').appendTo($('#repos_result'));
					$('</p>').appendTo($('#repos_result'));
				});
		 if(numberP==1)
		{
		   $('#button_get_previous_repos').attr("disabled",true);

		}
		else
		{

		}
				

	}).fail(function() {
		$("#repos_result").text("No repositories.");
	});

}


function get_previousRpos(prenumber)
{
	var url = API_BASE_URL+'/users/'+USERNAME +'/repos?page='+prenumber +'&per_page=3';
    $("#repos_result").text('');
    $("#page").text(prenumber);
	
	$.ajax
	({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr)
	{
		var repos = data;
		$.each(repos, function(i, v) 
				{
					var repo = v;

                    //$('<strong> Link: </strong> ' + link + '<br>').appendTo($('#repos_result'));
                    //$('<h4> Name: ' + valor + '</h4>').appendTo($('#repos_result'));
                    
					$('<h4> Name: ' + repo.name + '</h4>').appendTo($('#repos_result'));
					$('<p>').appendTo($('#repos_result'));	
					$('<strong> ID: </strong> ' + repo.id + '<br>').appendTo($('#repos_result'));
					$('<strong> URL: </strong> ' + repo.html_url + '<br>').appendTo($('#repos_result'));
					$('<strong> Description: </strong> ' + repo.description + '<br>').appendTo($('#repos_result'));
					$('</p>').appendTo($('#repos_result'));
				});
		if(prenumber==1)
		{
			$('#button_get_previous_repos').attr("disabled",true);

		}
		else
		{

		}
		if(data!== "")
		{
			$('#button_get_next_repos').removeAttr("disabled");

		}
		else
		{

		}


	}).fail(function() 
	{
		$("#repos_result").text("No repositories.");
	});



}

function get_nextRepos(nexnumber)
{
	var url = API_BASE_URL+'/users/'+USERNAME +'/repos?page='+nexnumber +'&per_page=3';
    $("#repos_result").text('');
    $("#page").text(nexnumber);
	
	$.ajax
	({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr)
	{
		var repos = data;
		$.each(repos, function(i, v) 
				{
					var repo = v;

                    //$('<strong> Link: </strong> ' + link + '<br>').appendTo($('#repos_result'));
                    //$('<h4> Name: ' + valor + '</h4>').appendTo($('#repos_result'));
					$('<h4> Name: ' + repo.name + '</h4>').appendTo($('#repos_result'));
					$('<p>').appendTo($('#repos_result'));	
					$('<strong> ID: </strong> ' + repo.id + '<br>').appendTo($('#repos_result'));
					$('<strong> URL: </strong> ' + repo.html_url + '<br>').appendTo($('#repos_result'));
					$('<strong> Description: </strong> ' + repo.description + '<br>').appendTo($('#repos_result'));
					$('</p>').appendTo($('#repos_result'));
				});
		if(nexnumber>1)
		{
			$('#button_get_previous_repos').removeAttr("disabled");

		}
		else
		{

		}


	    if(data== "")
		{
			$('#button_get_next_repos').attr("disabled",true);
			$("#repos_result").text("No  more repositories.");
			
		}
		else
		{

		}
	}).fail(function() 
	{
		$("#repos_result").text("No repositories.");
	});



}



function get_email()
{
	var url = API_BASE_URL+'/user/emails';
	$("#email_result").text('');
	$.ajax
	({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr)
	{
		console.log(data);
	    //var value =JSON.parse(data);	

	    $.each(data, function(index, value) 
	    {
	     $("#email_result").text('');
	     $('<h4> Email: ' + value.email + '</h4>').appendTo($('#email_result'));
	     $('<p>').appendTo($('#email_result'));
	     $('<h4> Primary: ' + value.primary + '</h4>').appendTo($('#email_result'));
	     $('<h4> verified: ' + value.verified + '</h4>').appendTo($('#email_result'));

	    } )  ;

	   
	}).fail(function() 
	{
		$("#email_result").text("No email");
	});

}










    
	

