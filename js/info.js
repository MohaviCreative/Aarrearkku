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



var spriteMap = [
    "Art/Eläimet/Hämähäkki_väri.jpg",
    "Art/Eläimet/Hevonen_väri.jpg",
    "Art/Eläimet/Hiiri_väri.jpg",
    "Art/Eläimet/Käärme_väri.jpg",
    "Art/Eläimet/Kala_väri.jpg",
    "Art/Eläimet/Kani_väri.jpg",
    "Art/Eläimet/Kissa_väri.jpg",
    "Art/Eläimet/Koira_väri.jpg",
    "Art/Eläimet/Lintu_väri.jpg",
    "Art/Eläimet/Lisko_väri.jpg",
    "Art/Eläimet/Marsu_väri.jpg",
    "Art/Eläimet/Rotta_väri.jpg"
]


var audios=
    [
        'Sounds/English/Animals/ENhamahakki.mp3',
        'Sounds/English/Animals/ENhevonen.mp3',
        'Sounds/English/Animals/ENhiiri.mp3',
        'Sounds/English/Animals/ENkarme.mp3',
        'Sounds/English/Animals/ENkala.mp3',
        'Sounds/English/Animals/ENkani.mp3',
        'Sounds/English/Animals/ENkissa.mp3',
        'Sounds/English/Animals/ENkoira.mp3',
        'Sounds/English/Animals/ENlintu.mp3',
        'Sounds/English/Animals/ENlisko.mp3',
        'Sounds/English/Animals/ENmarsu.mp3',
        'Sounds/English/Animals/ENrotta.mp3',
    ]

var feedbackAudio=[
    'Sounds/English/Feedback/ENgoodwork.mp3',
    'Sounds/English/Feedback/ENtryagain.mp3'
]

var sentences = [
    "spider",
    "horse",
    "mouse",
    "snake",
    "fish",
    "rabbit",
    "cat",
    "dog",
    "bird",
    "lizard",
    "guinea pig",
    "rat"
]

function GetFiles(language, subject){
    var allSounds=[]
    for(i = 0; i < words[subject].length; i++){
        var fileName = "Sounds/" + languages[language] + "/" + folders[subject] + "/" + languageShorts[language];
        allSounds[i] = GetFile(fileName, words[subject][i], language);
    }
    return allSounds;
}

function GetFile(path, name, i){
    var wholePath;

    for(o = 0; o < 2; o++){
        name = name.charAt(0).toUpperCase() + name.slice(1);
        wholePath = path+name+"."+fileTypes[i];

        if(UrlExists( wholePath))
            return  wholePath;

        name = name.charAt(0).toLowerCase() + name.slice(1);
         wholePath = path+name+"."+fileTypes[i];

        if(UrlExists( wholePath))
            return  wholePath;


        name = name.replace(/ä/g, "a").replace(/ö/g, "o");
        console.log(name);
    }
}

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}