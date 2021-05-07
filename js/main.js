var key = document.getElementById("key"); 
var str = document.getElementById("str"); 
var arr = document.getElementById("arr1"); 
var dec = document.getElementById("decryption");
var enc = document.getElementById("encryption"); 

var alphabetBoard = Array(Array(5), Array(5), Array(5), Array(5), Array(5)); 
var keyForSet = ""; 
var zCheck = ""; 
var oddFlag = false; 
var enc_result = ""; 

function checkSpecial(str) { 
    var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi; 
    if(special_pattern.test(str) == true) { 
        return true; 
    } else { 
        return false; 
    } 
}

function checkKor(str) {
    const regExp = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/; 
    if(regExp.test(str)){ 
          return true; 
    }else{ 
        return false; 
    } 
}

function init() {
    document.getElementById("key1").value = key.value;

    if(key.value === null || key.value === "" || str.value === null || str.value === "" ){
        alert("입력칸이 비었습니다.");
    }    
    else if(key.value.length<2||str.value.length<2){
        alert("최소 두글자 이상을 입력해주세요.");
    }
    else if(key.value.length>10||str.value.length>20){
        alert("최대 글자 수가 넘었습니다.");
    }
    else if(checkSpecial(key.value)===true||checkKor(key.value)===true||checkKor(str.value)===true){
        alert("특수 문자나 한글은 암호화할 수 없습니다.");
    }else{
        dataPreprocessing();
        setBoard();
        setStr();
        strEncryption(key.value, str.value);
        strDecryption(key.value, enc_result, zCheck);
        removeElements();
    }
}

function dataPreprocessing() {
    document.getElementById("key1").value = key.value;

    key.value = (key.value).toLowerCase();
    str.value = (str.value).toLowerCase();
    var RegExpHG = /[가-힣]/;
    var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi;
    
    if(regExp.test(str.value)){
        var t = (str.value).replace(regExp, "");
        t = (str.value).replace(RegExpHG,"");
        str.value = t;
    }
    if(regExp.test(key.value)){
        var t = (key.value).replace(regExp, "");
        t = (key.value).replace(RegExpHG,"");
        key.value = t;
    }
}
function makeDiv(paramKey){
    const table = document.getElementById("table"); 
    while (table.hasChildNodes()) { 
        table.removeChild(table.firstChild); 
    }
    let arrKey = paramKey.split('');
    console.log("arrKey : " + arrKey);
    for(let i=0; i<5; i++){
      let tr = document.createElement("tr");
      for(let j=0; j<5; j++){
        let th = document.createElement("th");
        let text = document.createTextNode(arrKey[i*5+j]);
        th.appendChild(text);
        tr.appendChild(th);
      }
      table.appendChild(tr);
    }
}


function makeEncArr(enc){
    const encTable = document.getElementById("encTable"); 
    let tr = document.createElement("tr");

    let new_enc = "";
    for (let i = 0; i < enc.length; i++) {
        if (i!==0 && i % 2 === 0) {
            new_enc += " ";
        }
        new_enc += enc[i];
    }  
    console.log(new_enc);
    let arrKey = new_enc.split(' ');
    console.log("arrKey : " + arrKey);

    for(let i = 0; i<arrKey.length; i++){
        let th = document.createElement("th");
        let text = document.createTextNode(arrKey[i]);
        th.appendChild(text);
        tr.appendChild(th);
    }
    encTable.appendChild(tr);

}

function makeMapArr(str){
    
    const mapTable = document.getElementById("mapTable");
    let tr = document.createElement("tr");
    
    let new_str = "";
    for (let i = 0; i < str.length; i++) {
        if (i!==0 && i % 2 === 0) {
            new_str += " ";
        }
        new_str += str[i];
    }  
    console.log(new_str);
    let arrKey = new_str.split(' ');
    console.log("arrKey : " + arrKey);

    for(let i = 0; i<arrKey.length; i++){
        let th = document.createElement("th");
        let text = document.createTextNode(arrKey[i]);
        th.appendChild(text);
        tr.appendChild(th);
    }
    mapTable.appendChild(tr);


}
function removeElements() {
    $('div').remove('.start');
    $('.result').css("display", "block");
}

function showDecryption(){
    $('div').remove('.encryption_str');
    $('.decryption_list').css("display", "block");
}

function again() {
    location.reload();
}
function setBoard() {
    key.value = (key.value).replace(/ /g, "");
    str.value = (str.value).replace(/ /g, "");
    key.value = (key.value).toLowerCase();

    var duplicationFlag = false; 
    var keyLengthCount = 0;

    key.value += "abcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < (key.value).length; i++) {

        for (let j = 0; j < keyForSet.length; j++) {
            if ((key.value).charAt(i) === keyForSet.charAt(j)) {
                duplicationFlag = true;
                break;
            }

        }
        if (!(duplicationFlag)) keyForSet += (key.value).charAt(i);
        duplicationFlag = false;
    }
    key.value = keyForSet;

    for (let i = 0; i < alphabetBoard.length; i++) {
        for (let j = 0; j < alphabetBoard[i].length; j++) {
            alphabetBoard[i][j] = keyForSet.charAt(keyLengthCount++);
        }
    }

    makeDiv(keyForSet);
}

function setStr() {
    for (let i = 0; i < (str.value).length; i++) {
        if ((str.value).charAt(i) == 'z') //z를 q로 바꿔줘서 처리함.
        {
            str.value = (str.value).substring(0, i) + 'q' + (str.value).substring(i + 1, (str.value).length);
            zCheck += 1;
        }
        else {
            zCheck += 0;
        }
    }
}

function strEncryption(key, str) {
    var playFair = ""; 
    var encPlayFair = ""; 
    var x1 = 0, x2 = 0, y1 = 0, y2 = 0; 
    var encStr = "";

    for (let i = 0; i < str.length; i+= 2) 
    {
        var tmpArr = new Array(2);                                                                                                                                                                
        tmpArr[0] = str.charAt(i);
        for (let j = 0; j < str.length; j++) {                             
            if (str.charAt(i) === str.charAt(i + 1)) 
            {
                if(zCheck.charAt(i,1) === '1' ^ zCheck.charAt(i+1,1) === '1'){
                    tmpArr = str.charAt(i+1,1);
                }
                else{
                    tmpArr += 'x';
                    i--;
                }
            }
            else {
                tmpArr[1] = str.charAt(i + 1);
            }                                                                                                                      
        }
        playFair += tmpArr;
        playFair = playFair.replace(/,/gi, "");
    }

    if (playFair.length % 2 === 1) {
        playFair += 'x';
        oddFlag = true;
    }
    makeMapArr(playFair);

    for (let i = 0; i < playFair.length; i+= 2) {
        var tmpArr = new Array(2);
        if(playFair[i] === playFair[i+1]){
            if(zCheck.charAt(i, 1) === '1'){
                tmpArr[0] = 'q';
                tmpArr[1] = 'z';
            }
            else {
                tmpArr[0] = 'z';
                tmpArr[1] = 'q';
            }
            for (let j = 0; j < tmpArr.length; j++) {
                encPlayFair += tmpArr[j];
            }
            continue;
        }


        for (let j = 0; j < alphabetBoard.length; j++) 
        {
            for (let k = 0; k < alphabetBoard[j].length; k++) {
                if (alphabetBoard[j][k] === playFair[i]) {
                    x1 = j;
                    y1 = k;
                }
                if (alphabetBoard[j][k] === playFair[i + 1]) {
                    x2 = j;
                    y2 = k;
                }
            }
        }

        if (x1 == x2) 
        {
            tmpArr[0] = alphabetBoard[x1][(y1 + 1) % 5];
            tmpArr[1] = alphabetBoard[x2][(y2 + 1) % 5];
        }
        else if (y1 == y2)
        {
            tmpArr[0] = alphabetBoard[(x1 + 1) % 5][y1];
            tmpArr[1] = alphabetBoard[(x2 + 1) % 5][y2];
        }
        else 
        {
            tmpArr[0] = alphabetBoard[x2][y1];
            tmpArr[1] = alphabetBoard[x1][y2];
        }

        for (let i = 0; i < tmpArr.length; i++) {
            encPlayFair += tmpArr[i];
        }
        encPlayFair += " ";
    }

    enc_result = encPlayFair.replace(/ /gi, ""); 
    enc.value = encPlayFair;
    
    makeEncArr(enc_result);
}



function strDecryption(key, str, zChk) { // 복호화
    var playFair = new Array(); 
    var decPlayFair = new Array(); 
    var x1 = 0, x2 = 0, y1 = 0, y2 = 0; 
    var decStr = "";

    for (let i = 0; i < str.length; i += 2) {
        var tmpArr = new Array();
        tmpArr[0] = str.charAt(i);
        tmpArr[1] = str.charAt(i + 1);
        playFair.push(tmpArr);
    }
    for (let i = 0; i < playFair.length; i++) {
        var tmpArr = new Array();
        for (let j = 0; j < alphabetBoard.length; j++) 
        {
            for (let k = 0; k < alphabetBoard[j].length; k++) {
                if (alphabetBoard[j][k] === playFair[i][0]) {
                    x1 = j;
                    y1 = k;
                    console.log("x1 ", x1, ", y1 ",y1, ", playFair[i][0] ",playFair[i][0]);
                }
                if (alphabetBoard[j][k] === playFair[i][1]) {
                    x2 = j;
                    y2 = k;
                    console.log("x2 ", x2, ", y2 ",y2, ", playFair[i+1] ",playFair[i][1]);
                }
            }
        }

        console.log(alphabetBoard);
        if (x1 === x2) 
        {
            tmpArr[0] = alphabetBoard[x1][(y1 + 4) % 5];
            tmpArr[1] = alphabetBoard[x2][(y2 + 4) % 5];
            console.log(tmpArr);
        }
        else if (y1 === y2) 
        {
            tmpArr[0] = alphabetBoard[(x1 + 4) % 5][y1];
            tmpArr[1] = alphabetBoard[(x2 + 4) % 5][y2];
        }
        else 
        {
            tmpArr[0] = alphabetBoard[x2][y1];
            tmpArr[1] = alphabetBoard[x1][y2];
        }

        decPlayFair.push(tmpArr);
    }

    for (let i = 0; i < decPlayFair.length; i++) 
    {
        if (i != decPlayFair.length - 1 && decPlayFair[i][1] == 'x' && decPlayFair[i][0] == decPlayFair[i + 1][0]) {
            decStr += decPlayFair[i][0];
        }
        else {
            decStr += decPlayFair[i][0] + "" + decPlayFair[i][1];
        }
    }

    for (let i = 0; i < zChk.length; i++)
    {
        if (zChk.charAt(i) == '1') {
            decStr = decStr.substring(0, i) + 'z' + decStr.substring(i + 1, decStr.length);
        }
    }
    if(decStr.slice(decStr.length-1,decStr.length) === 'x'){
        decStr = decStr.slice(0,length-1);
    }

    console.log(decStr);
    dec.value = decStr;
}