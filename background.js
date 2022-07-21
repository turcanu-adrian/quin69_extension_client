chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.set({isStalling: 'false', streamStarted: 'false'});
});

chrome.alarms.create('testAlarm', {
	periodInMinutes: 1
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "testAlarm") {
		console.log("ALARM ACTIVATED! FETCHING DATA...");
		fetch("https://quin69-extension.herokuapp.com/") 
			.then(response=>response.text()) 
			.then(data=>{
				if (data!=""){
					data = data.split('\n');
					chrome.storage.local.get(["isStalling", "streamStarted"], function(res) {
						if (data[1] == 'true' && res.streamStarted == 'false')
							chrome.storage.local.set({streamStarted:'true'}, function(){
								console.log("STREAMER LIVE NOTIFICATION");
								chrome.notifications.create('test', {
									type: 'basic',
									iconUrl: '/images/pogu64.png',
									title: 'STREAMER IS NOW LIVE',
									message: 'WATCH NOW',
									priority: 2
								});
							});
						else if (data[1]=='false'){
							chrome.storage.local.set({streamStarted:'false'}, function(){
								if (data[0] != res.isStalling){
									chrome.storage.local.set({isStalling: data[0]}, function(){
										if (data[0]=='true'){
											console.log("CREATING STALL NOTIFICATION");
											chrome.notifications.create('test', {
											type: 'basic',
											iconUrl: '/images/painchamp64.png',
											title: 'STREAMER IS NOW STALLING',
											message: 'They are Just Chatting',
											priority: 2
											});
										}
										else{
											console.log("CREATING NOT STALL NOTIFICATION");
											chrome.notifications.create('test', {
											type: 'basic',
											iconUrl: '/images/pogu64.png',
											title: 'STREAMER IS NOW NOT STALLING',
											message: 'They are now playing '+data[2],
											priority: 2
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
});