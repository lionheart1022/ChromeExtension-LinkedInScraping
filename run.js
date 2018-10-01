var stopping = false;
var intervals = [];
//var defaultAPI = "https://script.google.com/macros/s/AKfycbxxBGeUvhZ7oL-vVhjX8SKM9cbm1TzK0lXOZiBwQdWl2lLP_48/exec";
var defaultAPI = "http://localhost/SP/api/SPCall";
var defaultSearchDescription = "f935a4a30327ffa326dff3f2058c8f70373b3610";
var savedDetails = {};
var email = "";
var SearchDescription = "";


function start() {
    stopping = false;
    $('#extractor-start-button').text('Stop');
    startVisiting(0);
}

function stop() {
    stopping = true;
    $('#extractor-start-button').text('Start');
    //console.log('stop');
    for (var i = 0; i < intervals.length; i++) {
        clearInterval(intervals[i]);
    }
}



function startVisiting(i) {
function getSearchRowResults() {
    //console.log('waited three seconds to try again')
    }

    if (stopping) {
        stop();
        return;
    }
    var visited1 = parseInt($('#extractor-visited').text());
    if (savedDetails.COUNT != "" && parseInt(savedDetails.COUNT) > 0 && visited1 >= savedDetails.COUNT) {
        stop();
        return;
    }
    var peopleRows = $('li.search-results__result-item');
    peopleRows[i].scrollIntoView(false);
    var personRow = peopleRows[i];
    var personTitle = $(personRow).find('.result-lockup__name');
    var personViewed = '';
    var Viewed = $('li.search-results__result-item.viewed');


//console.log(personRow);
//console.log(personTitle);
//console.log(personRow && personTitle);
    
    if (personRow && personTitle) {
        var nowText = $(personTitle).first().find('a').text();
        if (nowText == '') {
        var nowText = $(personTitle).text();
        }
         //console.log(nowText);
        var personLink = "https://linkedin.com" + $(personTitle).first().find('a').attr('href');

        i++;

        //dont visit again if already visited
        if (!personLink || nowText.indexOf('LinkedIn Member') > -1 || nowText.indexOf('(Next To Visit)') > -1 || nowText.indexOf('(Visited)') > -1 || nowText.indexOf('(Skipped)') > -1) {
            //console.log('startvisiting');
            startVisiting(i);

            if (nowText.indexOf('(Skipped)') === -1) {
                nowText = nowText.replace(' (Visited)', '').replace(' (Next To Visit)', '');
                $(personTitle).text(nowText + ' (Skipped)');
            }
            return;
        }
//console.log('Mark1')
//console.log(nowText)
        nowText += " (Next To Visit)";
        $(personTitle).text(nowText);

        //var delay = Math.round(Math.random() * (3000 - 1000)) + 1000;
        var delay = Math.round(Math.random() * (78000 - 10000)) + 10000;
        var delayS = Math.round(delay / 1000);
        //delayS = 5 - 0;

        $('#extractor-next-visit').text(delayS + 's');

        var interval = setInterval(function() {
            delayS--;

            $('#extractor-next-visit').text(delayS + 's');

            if (delayS <= 0) {

                var intervalIndex = intervals.indexOf(interval);
                if (intervalIndex > -1) {
                    clearInterval(intervals[intervalIndex]);
                    intervals.splice(intervalIndex, 1);
                }
//console.log('Visit profile');
                //visitPerson(personLink, function(profileDetails) {
                var link=personLink
                $.get(link, function(data) {

                var startstringsearch = data.indexOf('{&quot;lastName&quot;:&quot');
                var positionofstartofurl = data.indexOf('{&quot;lastName&quot;:&quot', startstringsearch);
                var positionofendofurl = data.indexOf('</code>', positionofstartofurl);
                var json_text = data.substring(positionofstartofurl, positionofendofurl);
                var email = fetchMail(data)

                if (json_text !== undefined) {
                    //json_text = json_text.replace("<!--", "").replace("-->", "");

                    json_text = json_text.replace(/&quot;/g, '"');
                    json_text = json_text.replace(/&#92;"/g, '/');
                    //console.log(json_text);

                    try {
                        var json_obj = JSON.parse(json_text);
                        //console.log(json_obj);
                    } catch (err) {
                        console.log(err);
                        completed(profileDetails);
                        return;
                    }

                }

                var name = '',
                    headline = '',
                    locality = '';
                var industry = '',
                    twitter = '',
                    currentCompanyID = '';
                var currentCompanyName = '',
                    currentCompanyLink = '';
                var currentCompanyStart = '',
                    firstName = '',
                    lastName = '';
                var education = '',
                    connections = '',
                    skills = '';
                var email = '',
                    email1 = '',
                    phone = '',
                    interests = '';
                var link1 = '',
                    companyWebsite = '',
                    companyType = "";
                var headQuaters = "",
                    companySize = "",
                    companyFounded = "";
                var title = '',
                    searchdescription = '',
                    Field19 = '';
                var summary = '';


                if (json_obj !== undefined) {
                    name = json_obj.fullName || '';
                    firstName = json_obj.firstName || '';
                    lastName = json_obj.lastName || '';
                    title = json_obj.positions[0].title || '';
                    headline = json_obj.headline || '';
                    locality = json_obj.location || '';
                    industry = json_obj.industry || '';
                    link1 = json_obj.flagshipProfileUrl || '';
                    interests = json_obj.interests || '';
                    summary = json_obj.summary || '';
                    connections = json_obj.numOfConnections || '';

                    if (json_obj.positions !== undefined) {
                        currentCompanyName = json_obj.positions[0].companyName || '';
                    }

                    Field19 = link;

                    searchdescription = SearchDescription || '';

                    if (json_obj.contactInfo !== undefined) {

                        var twitter_array = json_obj.contactInfo.twitterAccounts || undefined;
                        if (twitter_array !== undefined)
                            twitter = twitter_array.join(', ');

                        var mail_array = json_obj.contactInfo.emails || undefined;
                        if (mail_array !== undefined)
                            email = mail_array.join('; ');

                        var phone_array = json_obj.contactInfo.phones || undefined;
                        if (phone_array !== undefined)
                            phone = phone_array.join(', ');

                        link = json_obj.contactInfo.publicProfileUrl || '';

                    }

                    if (json_obj.relatedColleagueCompanyId !== undefined) {

                        currentCompanyID = json_obj.relatedColleagueCompanyId || '';

                        if (currentCompanyID != '')
                            currentCompanyLink = 'https://www.linkedin.com/company/' + currentCompanyID;
                    }

                    if (json_obj.educations[0] !== undefined) {

                        education = json_obj.educations[0].schoolName || '';
                        contactComments = json_obj.educations[0].degree + ', ' + json_obj.educations[0].fieldsOfStudy || '';
                        contactComments = contactComments.replace(/&#39;/g, "'");

                    }
                }

                var profileDetails = {
                    name: name,
                    firstName: firstName,
                    lastName: lastName,
                    Title: title,
                    headline: headline,
                    locality: locality,
                    industry: industry,
                    currentCompanies: currentCompanyName,
                    contactComments: contactComments,
                    currentCompanyProfile: currentCompanyLink,
                    education: education,
                    skills: skills,
                    link: link1,
                    companyWebsite: companyWebsite,
                    Field19: Field19,
                    SearchDescription: SearchDescription,
                    summary: summary,
                    companySize: companySize
                };

                var skills_array = [];

                $.ajax({
                    url: link1,
                    type: 'get',
                    timeout: 10000,
                    error: function(err) {}
                }).done(function(data) {
                    try {
                        var startstringsearch = data.indexOf('{&quot;$deletedFields&quot;:[&quot;standardizedSkillUrn');
                        var positionofstartofurl = data.indexOf('{&quot;$deletedFields&quot;:[&quot;standardizedSkillUrn', startstringsearch);
                        var positionofendofurl = data.indexOf('profile.SkillView&quot;}', positionofstartofurl);
                        var profile_data = data.substring(positionofstartofurl, positionofendofurl);

                        if (profile_data !== undefined) {

                            profile_data = profile_data.replace(/&quot;/g, '"');
                            profile_data = profile_data.replace(/&#92;"/g, '/');

                            try {
                                var profile_obj = JSON.parse('[' + profile_data + '"}]');

                                profile_obj.pop();
                                profile_obj.forEach(function(element) {
                                    skills_array.push(element.name);
                                });
                            } catch (err) {}
                        }
                        profileDetails.skills = skills_array.join(', ');
                        
                        var startsummarysearch = data.indexOf('&quot;summary&quot;:');
                        var positionofstartofsummary = data.indexOf('&quot;summary&quot;:', startsummarysearch);
                        var positionofendofsummary = data.indexOf(',&quot;industryName&quot;', positionofstartofsummary);
                        var summary_data = data.substring(positionofstartofsummary, positionofendofsummary);
                        
                        if (summary_data !== undefined) {

                            summary_data = summary_data.replace(/&quot;/g, '"');
                            summary_data = summary_data.replace(/&#92;"/g, '/');
                            
                            var summary_obj = JSON.parse('{' + summary_data + '}');
                            profileDetails.summary = summary_obj.summary;                            
                        }
                        else {
                        profileDetails.summary=''
                        }
                        
                        return;
                    } catch (e) {}
                });
                if (currentCompanyLink === '') {
                    completed(profileDetails);
                    return;
                } else {
                    $.ajax({
                        url: currentCompanyLink,
                        type: 'get',
                        timeout: 10000,
                        error: function(err) {}
                    }).done(function(data) {
                        try {
                            var startstringsearch = data.indexOf('&quot;companyPageUrl&quot;');
                            var positionofstartofurl = data.indexOf('http', startstringsearch);
                            var positionofendofurl = data.indexOf('&quot;,', positionofstartofurl);
                            var companyurl = data.substring(positionofstartofurl, positionofendofurl);

                            if (positionofstartofurl === -1) {
                                completed(profileDetails);
                                return;
                            }

                            var positionstart = data.indexOf('{&quot;$deletedFields&quot;:[],&quot;start&quot;:', startstringsearch);
                            
                            if(positionstart === -1) {
                                positionstart = data.indexOf('{&quot;$deletedFields&quot;:[&quot;end&quot;],&quot;start&quot;:', startstringsearch);
                            }
                            var positionend = data.indexOf(',&quot;$type&quot;', positionstart);
                            var companyRange = data.substring(positionstart, positionend) + '}';
                            companyRange = companyRange.replace(/&quot;/g, '"');
                            companyRange = JSON.parse(companyRange);

                            profileDetails.companyWebsite = companyurl || '';
                            
                            if(companyRange.end) {
                                profileDetails.companySize = companyRange.start + '-' + companyRange.end + ' employees' || '';
                            }
                            else {
                                profileDetails.companySize = companyRange.start + '+' + ' employees' || '';
                            }

                            completed(profileDetails);
                            debugger;
                            return;
                        } catch (e) {}
                    });
                }

                //console.log(profileDetails); 
                debugger; 
                saveOrPrint(profileDetails);                          
               //debugger;
            });
            //console.log('Dont stop here');

                    var visited = parseInt($('#extractor-visited').text());
                    visited++;
                    $('#extractor-visited').text(visited);
//console.log('Mark 2')
                    if (nowText.indexOf('(Visited)') === -1) {
                        nowText = nowText.replace('(Next To Visit)', '(Visited)');
                        $(personTitle).text(nowText);
                    }
                    startVisiting(i);
                    return;
                //});
            }
        }, 1000);

        intervals.push(interval);

    } else {
//console.log('Next');
        var next = $('.search-results__pagination-next-button');

        if (next && next[0]) {
            next[0].click();

            setTimeout(function() {
                startVisiting(0);
            }, 4000);
        } else {
            stop();
        }
    }
}

function findElementInArrayById(arr, elid) {
    for (var i = 0; i < arr.length; i++) {
        var el = arr[i];
        if (el.id === elid) {
            return el;
        }
    }
    return undefined;
}


function visitPerson(link, completed, counter) {
    //console.log('visitperson');
    try {
        if (!counter || counter < 3) {
            // CODE
            $.get(link, function(data) {

                var startstringsearch = data.indexOf('{&quot;lastName&quot;:&quot');
                var positionofstartofurl = data.indexOf('{&quot;lastName&quot;:&quot', startstringsearch);
                var positionofendofurl = data.indexOf('</code>', positionofstartofurl);
                var json_text = data.substring(positionofstartofurl, positionofendofurl);
                var email = fetchMail(data)

                if (json_text !== undefined) {
                    //json_text = json_text.replace("<!--", "").replace("-->", "");

                    json_text = json_text.replace(/&quot;/g, '"');
                    json_text = json_text.replace(/&#92;"/g, '/');
                    //console.log(json_text);

                    try {
                        var json_obj = JSON.parse(json_text);
                        //console.log(json_obj);
                    } catch (err) {
                        console.log(err);
                        completed(profileDetails);
                        return;
                    }

                }

                var name = '',
                    headline = '',
                    locality = '';
                var industry = '',
                    twitter = '',
                    currentCompanyID = '';
                var currentCompanyName = '',
                    currentCompanyLink = '';
                var currentCompanyStart = '',
                    firstName = '',
                    lastName = '';
                var education = '',
                    connections = '',
                    skills = '';
                var email = '',
                    email1 = '',
                    phone = '',
                    interests = '';
                var link1 = '',
                    companyWebsite = '',
                    companyType = "";
                var headQuaters = "",
                    companySize = "",
                    companyFounded = "";
                var title = '',
                    searchdescription = '',
                    Field19 = '';
                var summary = '';


                if (json_obj !== undefined) {
                    name = json_obj.fullName || '';
                    firstName = json_obj.firstName || '';
                    lastName = json_obj.lastName || '';
                    title = json_obj.positions[0].title || '';
                    headline = json_obj.headline || '';
                    locality = json_obj.location || '';
                    industry = json_obj.industry || '';
                    link1 = json_obj.flagshipProfileUrl || '';
                    interests = json_obj.interests || '';
                    summary = json_obj.summary || '';
                    connections = json_obj.numOfConnections || '';

                    if (json_obj.positions !== undefined) {
                        currentCompanyName = json_obj.positions[0].companyName || '';
                    }

                    Field19 = link;

                    searchdescription = SearchDescription || '';

                    if (json_obj.contactInfo !== undefined) {

                        var twitter_array = json_obj.contactInfo.twitterAccounts || undefined;
                        if (twitter_array !== undefined)
                            twitter = twitter_array.join(', ');

                        var mail_array = json_obj.contactInfo.emails || undefined;
                        if (mail_array !== undefined)
                            email = mail_array.join('; ');

                        var phone_array = json_obj.contactInfo.phones || undefined;
                        if (phone_array !== undefined)
                            phone = phone_array.join(', ');

                        link = json_obj.contactInfo.publicProfileUrl || '';

                    }

                    if (json_obj.relatedColleagueCompanyId !== undefined) {

                        currentCompanyID = json_obj.relatedColleagueCompanyId || '';

                        if (currentCompanyID != '')
                            currentCompanyLink = 'https://www.linkedin.com/company/' + currentCompanyID;
                    }

                    if (json_obj.educations[0] !== undefined) {

                        education = json_obj.educations[0].schoolName || '';
                        contactComments = json_obj.educations[0].degree + ', ' + json_obj.educations[0].fieldsOfStudy || '';
                        contactComments = contactComments.replace(/&#39;/g, "'");

                    }
                }

                var profileDetails = {
                    name: name,
                    firstName: firstName,
                    lastName: lastName,
                    Title: title,
                    headline: headline,
                    locality: locality,
                    industry: industry,
                    currentCompanies: currentCompanyName,
                    contactComments: contactComments,
                    currentCompanyProfile: currentCompanyLink,
                    education: education,
                    skills: skills,
                    link: link1,
                    companyWebsite: companyWebsite,
                    Field19: Field19,
                    SearchDescription: SearchDescription,
                    summary: summary,
                    companySize: companySize
                };

                var skills_array = [];

                $.ajax({
                    url: link1,
                    type: 'get',
                    timeout: 10000,
                    error: function(err) {}
                }).done(function(data) {
                    try {
                        var startstringsearch = data.indexOf('{&quot;$deletedFields&quot;:[&quot;standardizedSkillUrn');
                        var positionofstartofurl = data.indexOf('{&quot;$deletedFields&quot;:[&quot;standardizedSkillUrn', startstringsearch);
                        var positionofendofurl = data.indexOf('profile.SkillView&quot;}', positionofstartofurl);
                        var profile_data = data.substring(positionofstartofurl, positionofendofurl);

                        if (profile_data !== undefined) {

                            profile_data = profile_data.replace(/&quot;/g, '"');
                            profile_data = profile_data.replace(/&#92;"/g, '/');

                            try {
                                var profile_obj = JSON.parse('[' + profile_data + '"}]');

                                profile_obj.pop();
                                profile_obj.forEach(function(element) {
                                    skills_array.push(element.name);
                                });
                            } catch (err) {}
                        }
                        profileDetails.skills = skills_array.join(', ');
                        
                        var startsummarysearch = data.indexOf('&quot;summary&quot;:');
                        var positionofstartofsummary = data.indexOf('&quot;summary&quot;:', startsummarysearch);
                        var positionofendofsummary = data.indexOf(',&quot;industryName&quot;', positionofstartofsummary);
                        var summary_data = data.substring(positionofstartofsummary, positionofendofsummary);
                        
                        if (summary_data !== undefined) {

                            summary_data = summary_data.replace(/&quot;/g, '"');
                            summary_data = summary_data.replace(/&#92;"/g, '/');
                            
                            var summary_obj = JSON.parse('{' + summary_data + '}');
                            profileDetails.summary = summary_obj.summary;                            
                        }
                        else {
                        profileDetails.summary=''
                        }
                        
                        return;
                    } catch (e) {}
                });

                if (currentCompanyLink === '') {
                    completed(profileDetails);
                    return;
                } else {
                    $.ajax({
                        url: currentCompanyLink,
                        type: 'get',
                        timeout: 10000,
                        error: function(err) {}
                    }).done(function(data) {
                        try {
                            var startstringsearch = data.indexOf('&quot;companyPageUrl&quot;');
                            var positionofstartofurl = data.indexOf('http', startstringsearch);
                            var positionofendofurl = data.indexOf('&quot;,', positionofstartofurl);
                            var companyurl = data.substring(positionofstartofurl, positionofendofurl);

                            if (positionofstartofurl === -1) {
                                completed(profileDetails);
                                return;
                            }

                            var positionstart = data.indexOf('{&quot;$deletedFields&quot;:[],&quot;start&quot;:', startstringsearch);
                            
                            if(positionstart === -1) {
                                positionstart = data.indexOf('{&quot;$deletedFields&quot;:[&quot;end&quot;],&quot;start&quot;:', startstringsearch);
                            }
                            var positionend = data.indexOf(',&quot;$type&quot;', positionstart);
                            var companyRange = data.substring(positionstart, positionend) + '}';
                            companyRange = companyRange.replace(/&quot;/g, '"');
                            companyRange = JSON.parse(companyRange);

                            profileDetails.companyWebsite = companyurl || '';
                            
                            if(companyRange.end) {
                                profileDetails.companySize = companyRange.start + '-' + companyRange.end + ' employees' || '';
                            }
                            else {
                                profileDetails.companySize = companyRange.start + '+' + ' employees' || '';
                            }

                            completed(profileDetails);
                            return;
                        } catch (e) {}
                    });
                }

                //console.log(profileDetails);  
                saveOrPrint(profileDetails);                          
               debugger;
            });
            //console.log('Dont stop here');
        } else {
            console.log('sorry, person with link was not loaded (after 3 attempts) ' + link);
        }
    } catch (err) {
        console.log(err);
        var i = 0;
        if (counter) {
            i = counter + 1;
        } else i = 0;
        //console.log('Mark 3')
        setTimeout(visitPerson(link, completed, i), 5000);
        //console.log('Mark 4')
        if (counter == 2) {
            console.log('error: ' + err);
        }
    }
}


function saveOrPrint(details) {
    try {
        var API = savedDetails.API;
        var detail = jQuery.param(details);
        if (API) {
            try {
                $.ajax({
                    url: API,
                    type: 'POST',
                    dataType: 'application/json',
                    data: detail,
                    success: function(returned) {},
                    error: function(err) {}
                })
            } catch (e) {}

        } else {
            try {
                console.log('else try');
                $.ajax({
                    url: defaultAPI,
                    type: 'POST',
                    dataType: 'text',
                    data: detail,
                    timeout: 1,
                    headers: {
                        "Content-Security-Policy": "default-src 'none';",
                        "Content-Security-Policy": "script-src 'self' https://script.google.com https://script.googleusercontent.com;",
                        "content_security_policy": "script-src 'self' https://script.google.com https://script.googleusercontent.com; object-src 'self'",
                        "X-Frame-Options": "sameorigin",
                        "X-Permitted-Cross-Domain-Policies": "master-only",
                        "X-XSS-Protection": "1; mode=block"
                    },
                    success: function(returned) {
                        //console.log('success');
                    },
                    error: function(err) {}
                })
            } catch (e) {}
        }
    } catch (err) {
        console.log(err.message);
    }
}


function detect_element(elem, root, callback) {
    root = root || document;
    for (var r = root.querySelectorAll(elem), o = 0; o < r.length; o++)
        "1" !== r[0].dataset.detected && (r[0].dataset.detected = "1", callback(r[0]));
    var i = new MutationObserver(function(r) {
        var o = root.querySelectorAll(elem);
        if (o) {
            for (var i = 0; i < o.length; i++)
                "1" !== o[i].dataset.detected && (o[i].dataset.detected = "1", callback(o[i]));
        }
    });
    i.observe(root, {
        childList: !0,
        subtree: !0
    });
}

function initialize(complete) {
    
    chrome.runtime.sendMessage({
        'message': 'load'
    }, function(returnedDetails) {
        if (returnedDetails)
            savedDetails = returnedDetails;

        var API = savedDetails.API || '';
        var COUNT = savedDetails.COUNT || '';
        SearchDescription = savedDetails.SearchDescription || '';

        detect_element('body', document, function(bodyElement) {
            $.get(chrome.extension.getURL("toolbar.html"), function(toolbarHTML) {
                $(bodyElement).append(toolbarHTML);

                if (API) {
                    $('#extractor-save-to').val(API);
                }

                if (SearchDescription) {
                    $('#extractor-email').val(SearchDescription);
                }

                if (COUNT) {
                    $('#extractor-crawl-count').val(COUNT);
                }

                // event handlers
                $(bodyElement).on('click', '#extractor-start-button', function() {
                    var text = $(this).text();
                    if (text == 'Start') {
                        start();
                    } else {
                        stop();
                    }
                });

                $(bodyElement).on('click', '#extractor-change-save', function() {
                    var text = $(this).text();
                    var self = this;

                    var API = $('#extractor-save-to').val();

                    if (API) {
                        savedDetails.API = API;
                        chrome.runtime.sendMessage({
                            'message': 'save',
                            'toSaveDetails': savedDetails
                        }, function() {});
                        $(this).text("Saved!").attr('disabled', true);
                    } else {
                        $(this).text("Invalid API Endpoint").attr('disabled', true);
                    }

                    setTimeout(function() {
                        $(self).text(text).attr('disabled', false);
                    }, 2000);
                });

                $(bodyElement).on('click', '#extractor-change-count', function() {
                    var text = $(this).text();
                    var self = this;

                    var COUNT = $('#extractor-crawl-count').val();

                    if (COUNT) {
                        savedDetails.COUNT = COUNT;
                        chrome.runtime.sendMessage({
                            'message': 'save',
                            'toSaveDetails': savedDetails
                        }, function() {});
                        $(this).text("Saved!").attr('disabled', true);
                    } else {
                        $(this).text("Invalid Number").attr('disabled', true);
                    }

                    setTimeout(function() {
                        $(self).text(text).attr('disabled', false);
                    }, 2000);
                });

                $(bodyElement).on('click', '#extractor-email-save', function() {
                    var text = $(this).text();
                    var self = this;

                    var SearchDescription = $('#extractor-email').val();

                    if (SearchDescription) {
                        savedDetails.SearchDescription = SearchDescription;
                        chrome.runtime.sendMessage({
                            'message': 'save',
                            'toSaveDetails': savedDetails
                        }, function() {});
                        $(this).text("Saved!").attr('disabled', true);
                    } else {
                        $(this).text("Invalid API key").attr('disabled', true);
                    }

                    setTimeout(function() {
                        $(self).text(text).attr('disabled', false);
                    }, 2000);
                });

                complete();
            });
        });
    });

}

$(function() {
    initialize(function() {});
});



function fetchMail(html) {
    var getChunk = html;

    function extractEmails(chunk) {
        return chunk.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}\b/ig);
    }

    function unique(list) {
        var result = [];
        $.each(list, function(i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
        });
        return result;
    }

    function objectToString(object) {
        var stringify = "";
        for (var property in object) {
            stringify += object[property] + '<br>';
        }
        return stringify;
    }

    return unique(extractEmails(getChunk));;
}

function fetchPhone(html) {
    var getChunk = html;

    function extractPhone(chunk) {
        //return chunk.match(/\b[+]{0,1}[0-9]{0,3}[.\- ]{0,1}[(]{0,1}[0-9]{3,3}[)]{0,1}[.\- ]{0,1}[0-9]{3,3}[.\- ]{0,1}[0-9]{4,4}\b/ig);
        return chunk.match(/\b[+]{0,1}[0-9]{0,3}[.\- ]{0,1}[(]{0,1}[0-9]{3,3}[)]{0,1}[.\- ]{1,1}[0-9]{3,3}[.\- ]{0,1}[0-9]{4,4}\b/ig);
    }

    function uniquePhone(list) {
        var result = [];
        $.each(list, function(i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
        });
        return result;
    }

    function objectToString(object) {
        var stringify = "";
        for (var property in object) {
            stringify += object[property] + '<br>';
        }
        return stringify;
    }

    return uniquePhone(extractPhone(getChunk));
}
