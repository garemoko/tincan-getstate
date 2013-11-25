/*
=============COPYRIGHT============ 
Tin Statement Sender - An I-Did-This prototype for Tin Can API 0.95
Copyright (C) 2012  Andrew Downes

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, version 3.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
<http://www.gnu.org/licenses/>.
*/

//TODO: fix the display of the remove agent button and allow 0 agent groups

/*============DOCUMENT READY==============*/
$(function(){
	
	
	//Set Up LRS
	//Add one blank LRS to the page by default
	appendLRS();
	//When the user clicks '+LRS', append an extra LRS
	$('#lrsLrsAdd').click(appendLRS);
	$('#lrsLrsRemove').click({elementId: 'lrs', propertyClass: 'lrs', minimum:1},removeProperty);
	getLRSFromQueryString();
	
	
	//Set up Actor
	appendGroup('actorAgent').addClass('displayNone');
	appendAgent('actorAgent');
	$('#actorObjectType').change({elementId: 'actor'},ObjectTypeChanged);
	$('#actorAgentAdd').click({elementId: 'actorAgent'},appendAgentOnEvent);
	$('#actorAgentRemove').click({elementId: 'actorAgent', propertyClass: 'agent', minimum:0},removeProperty);
	
	//get state
	$('#getState').click(getState);
	
	//Set debug defaults
	var setDebugDefaults = true;
	
	if (setDebugDefaults){
		$('#endpoint0').val('http://cloud.scorm.com/ScormEngineInterface/TCAPI/public/');
		$('#basicLogin0').val('x');
		$('#basicPass0').val('x');
		$('#actorAgentName1').val('Andrew Downes');
		$('#actorAgentFunctionalIdentifier1').val('mrdownes@hotmail.com');
		$('#activityId').val('http://tincanapi.co.uk/exampleactivity');
	}
	
});
/*============END DOCUMENT READY==============*/


/*============get the state==============*/
function getState()
{

	//Create an instance of the Tin Can Library
	var myTinCan = new TinCan();
	
	myTinCan.DEBUG = 1;
	
	//LRS
	$('#lrs').find('.lrs').each(function(index){
		var myLRS = new TinCan.LRS({
			endpoint:$(this).find('.endpoint').val(), 
			version: $(this).find('.version').val(),
			auth: 'Basic ' + Base64.encode($(this).find('.basicLogin').val() + ':' + $(this).find('.basicPass').val())
		});
		myTinCan.recordStores[index] = myLRS;
	});
	
	var myActor;
	switch($('#actorObjectType').val())
	{
		case 'Agent':
			myActor = getActor($('#actor').find('.agent:first'));
		break;
		case 'Group':
			myActor = getActor($('#actor').find('.group:first'), 'Group');
			console.log(JSON.stringify(myActor));
			 $('#actor').find('.agent').each(function(index){
			 	var agentToAddToGroup = getActor($(this));
				myActor.member.push(agentToAddToGroup);
			 });
		break;
	}
	myTinCan.actor = myActor;
	
	
	 

	document.write (
		JSON.stringify(
			myTinCan.getState(
				$('#key').val(),
				{
					agent : myActor,
					activity : {
						id : $('#activityId').val()
					},
					registration : $('registration').val()
				}
			)
		)
	);

}

