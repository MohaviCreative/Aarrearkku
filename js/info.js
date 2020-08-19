var spriteLocation ="Sounds"

var folders = [
    "Colors",
    "Animals",
    "Hobbies",
    "Numbers",
    "Weather"
]

var languages = [
    "Swedish",
    "English",
    "German",
    "Chinese",
    "Russian",
    "Spanish",
    "French"
]

var languageShorts = [
    "sv",
    "en",
    "de",
    "ki",
    "ru",
    "es",
    "fr"
]

var fileTypes = [
    "m4a",
    "mp3",
    "m4a",
    "m4a",
    "mp3",
    "mp3",
    "m4a"
]

var words = [
    [
        "harmaa",
        "keltainen",
        "musta",
        "oranssi",
        "punainen",
        "ruskea",
        "sininen",
        "vaaleanpunainen",
        "valkoinen",
        "vihrea",
        "violetti"
    ],
    [
        "hamahakki",
        "hevonen",
        "hiiri",
        "kaarme",
        "kala",
        "kani",
        "kissa",
        "koira",
        "lintu",
        "lisko",
        "marsu",
        "rotta"
    ],
    [
        "hiihtaa",
        "luistella",
        "pelatajaakiekkoa",
        "pelatajalkapalloa",
        "piirtaa",
        "ratsastaa",
        "soittaakitaraa",
        "soittaapianoa",
        "tanssia",
        "voimistella"
    ],
    [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20"
    ],
    [
        "aurinkopaistaa",
        "millainensaaon",
        "onhuonosaa",
        "onhyvasaa",
        "onkuuma",
        "onkylma",
        "onpilvista",
        "sataa",
        "sataalunta",
        "tuulee"
    ]
]

var feedbackAudio = [
    'welldone',
    'tryagain'
]

function GetFeedback(language){
    var path = "Sounds/" + languages[language] + "/Feedback/" + languageShorts[language];
    return GetFiles(fileTypes[language], path, feedbackAudio);
}

function GetSounds(language, subject){
    var path = "Sounds/" + languages[language] + "/" + folders[subject] + "/" + languageShorts[language];

    return GetFiles(fileTypes[language], path, words[subject]);
}

function GetImages(subject){
    var path = "Art/" + folders[subject] + "/";
    return GetFiles("jpg", path, words[subject], "_vari");
}

function GetFiles(fileType, path, wordList, extra){
    var allFiles = []
    for(i = 0; i < wordList.length; i++){
        allFiles[i] = GetFile(path, wordList[i] ,fileType, extra);
    }
    return allFiles;
}

function GetFile(path, actualName, fileType, extra){
    var wholePath;

    var name =  actualName;

    if(extra != undefined){


        wholePath = path + name + extra + "." + fileType;

        if(UrlExists( wholePath))
            return  wholePath;
    }

    wholePath = path + name + "." + fileType;

    if(UrlExists( wholePath))
        return  wholePath;

    console.log("Couldn't find file:\n" + name + extra + "." + fileType );
}

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}