var spriteLocation ="Sounds"

var folders =[
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
    "SV",
    "EN",
    "DE",
    "ki",
    "RU",
    "ES",
    "fr"
]

var fileTypes=[
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
        "vihreä",
        "violetti"
    ],
    [
        "hämähäkki",
        "hevonen",
        "hiiri",
        "käärme",
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
        "hiihtää",
        "luistella",
        "pelatajääkiekkoa",
        "pelatajalkapalloa",
        "piirtää",
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
        "millainensääon",
        "onhuonosää",
        "onhyväsää",
        "onkuuma",
        "onkylmä",
        "onpilvistä",
        "sataa",
        "sataalunta",
        "tuulee"
    ]
]

var feedbackAudio=[
    'ENgoodwork.mp3',
    'ENtryagain.mp3'
]

function GetSounds(language, subject){
    var path = "Sounds/" + languages[language] + "/" + folders[subject] + "/" + languageShorts[language];

    return GetFiles(fileTypes[language], path, words[subject]);
}

function GetImages(subject){
    var path = "Art/" + folders[subject] + "/";
    return GetFiles("jpg", path, words[subject], "_väri");
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

    for(o = 0; o < 2; o++){
        var name =  actualName;
        if(o == 1)
            name = name.replace(/ä/g, "a").replace(/ö/g, "o");

        name = name.charAt(0).toUpperCase() + name.slice(1);

        if(extra != undefined){


            wholePath = path + name + extra + "." + fileType;

            if(UrlExists( wholePath))
                return  wholePath;
        }

        wholePath = path + name + "." + fileType;

        if(UrlExists( wholePath))
            return  wholePath;

        name = name.charAt(0).toLowerCase() + name.slice(1);



        if(extra != undefined){

            wholePath = path + name + extra + "." + fileType;

            if(UrlExists( wholePath))
                return  wholePath;
        }

        wholePath = path + name +  "."+  fileType;

        if(UrlExists(wholePath))
            return  wholePath;

        if(o==1){
            console.log("Couldn't find file:\n" + name + "." + fileType);
        }
    }
}

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}