function handleOnInput(e){ 
    e.value = e.value.replace(/[^A-Za-z]/ig, '')
} // 영어만 입력받기

	

var key = document.getElementById("key"); // 암호화에 쓰일 키
var str = document.getElementById("str"); // 암호화할 문자열
var arr = document.getElementById("arr1"); // 만들어진 알파벳 배열 출력
var enc = document.getElementById("encryption"); // 암호문 출력
var dec = document.getElementById("decryption"); // 복호문 출력
var alphabetBoard = Array(Array(5), Array(5), Array(5), Array(5), Array(5)); // 2차원 배열 선언
var keyForSet = ""; // 중복 없앤 key 값
var blankCheck = ""; // 빈 칸 체크하는 변수 (안 씀)
var zCheck = ""; // 암호문에 있는 z값의 위치 확인하는 변수
var oddFlag = false; // 암호문에서 홀수 판별
var enc_result = ""; // 암호화 한 결과

// 모든 함수 실행은 여기서
function init() {
    dataPreprocessing();
    setBoard();
    setStr();
    // setArr();
    strEncryption(key.value, str.value);
    strDecryption(key.value, enc_result, zCheck);
    removeElements();
}

function makeDiv(paramKey){
    // 원래 있던 . 으로 이루어진 테이블 삭제하기
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
// 데이터 전처리
function dataPreprocessing() {
    document.getElementById("key1").value = key.value;
    document.getElementById("str1").value = str.value;

    key.value = (key.value).toLowerCase();
    str.value = (str.value).toLowerCase();
    var RegExpHG = /[가-힣]/;
    var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi;
    
    if(regExp.test(str.value)){
        var t = (str.value).replace(regExp, "");
        t = (str.value).replace(RegExpHG,"");
        str.value = t;
    }
    

    // console.log(str.value); //특수문자, 한글

    if(regExp.test(key.value)){
        var t = (key.value).replace(regExp, "");
        t = (key.value).replace(RegExpHG,"");
        key.value = t;
    }
    // console.log(key.value); //특수문자
}

function removeElements() {
    $('div').remove('.start');
    $('.result').css("display", "block");
}

function again() {
    location.reload();
}

function setArr(){
    for(let i=0; i < alphabetBoard.length; i++){
        
        for(let j=0; j < alphabetBoard[i].length; j++){
            arr.innerHTML += alphabetBoard[i][j]+"  ";
        }
        arr.innerHTML += "<br>";
    }
}

// alphabetBoard 배열에 중복없이 넣기
function setBoard() {
    key.value = (key.value).replace(/ /g, "");
    str.value = (str.value).replace(/ /g, "");
    key.value = (key.value).toLowerCase();

    var duplicationFlag = false; // 중복 검열
    var keyLengthCount = 0;

    key.value += "abcdefghijklmnopqrstuvwxyz";

    // 중복 처리 (key.value) 사용해야함
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

    //배열에 대입
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
    var playFair = ""; // 바꾸기 전 쌍자암호를 저장할 곳
    var encPlayFair = ""; // 바꾼 후 쌍자암호를 저장할 곳
    var x1 = 0, x2 = 0, y1 = 0, y2 = 0; // 두 글자의 각각의 행, 열 값
    var encStr = "";

    for (let i = 0; i < str.length; i+= 2) // arraylist 세팅
    {
        var tmpArr = new Array(2);                                                                                                                                                                
        tmpArr[0] = str.charAt(i);
        // console.log("1 zCheck: ",zCheck);
        for (let j = 0; j < str.length; j++) {                             
            if (str.charAt(i) === str.charAt(i + 1)) //글이 반복되면 x추가
            {
                if(zCheck.charAt(i,1) === '1' ^ zCheck.charAt(i+1,1) === '1'){
                    // console.log("둘이 xor");
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
        // console.log("1playFair : ",playFair);
    }

    if (playFair.length % 2 === 1) {
        playFair += 'x';
        oddFlag = true;
    }
    // console.log(playFair);

    for (let i = 0; i < playFair.length; i+= 2) {
        var tmpArr = new Array(2);
        // console.log("22 zCheck: ",zCheck);
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

        // console.log("2playFair : ",playFair);

        for (let j = 0; j < alphabetBoard.length; j++) //쌍자암호의 각각 위치체크
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

        if (x1 == x2) //행이 같은경우
        {
            tmpArr[0] = alphabetBoard[x1][(y1 + 1) % 5];
            tmpArr[1] = alphabetBoard[x2][(y2 + 1) % 5];
        }
        else if (y1 == y2) //열이 같은 경우
        {
            tmpArr[0] = alphabetBoard[(x1 + 1) % 5][y1];
            tmpArr[1] = alphabetBoard[(x2 + 1) % 5][y2];
        }
        else //행, 열 모두 다른경우
        {
            tmpArr[0] = alphabetBoard[x2][y1];
            tmpArr[1] = alphabetBoard[x1][y2];
        }

        for (let i = 0; i < tmpArr.length; i++) {
            encPlayFair += tmpArr[i];
        }
        encPlayFair += " ";
    }

    // if(encPlayFair.lastIndexOf(",") !== -1)
    //     encPlayFair=encPlayFair.substring(0, encPlayFair.length-1);

    // for (let i = 0; i < encPlayFair.length; i++) {
    //     encStr += encPlayFair[i][0] + "" + encPlayFair[i][1] + " ";
    // }
    enc.value = encPlayFair;
    enc_result = encPlayFair.replace(/ /gi, "");
    // console.log(enc_result)

}

function strDecryption(key, str, zChk) {
    var playFair = new Array(); // 바꾸기 전 쌍자암호를 저장할 곳
    var decPlayFair = new Array(); // 바꾼 후 쌍자암호를 저장할 곳
    var x1 = 0, x2 = 0, y1 = 0, y2 = 0; // 두 글자의 각각의 행, 열 값
    var decStr = "";

    for (let i = 0; i < str.length; i += 2) {
        var tmpArr = new Array();
        tmpArr[0] = str.charAt(i);
        tmpArr[1] = str.charAt(i + 1);
        playFair.push(tmpArr);
    }
    for (let i = 0; i < playFair.length; i++) {
        var tmpArr = new Array();
        for (let j = 0; j < alphabetBoard.length; j++) //쌍자암호의 각각 위치체크
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
        // console.log("if 문 시작하기 전에 확인 x1,x2,y1,y2 : ", x1, x2, y1, y2);
        if (x1 === x2) //행이 같은경우
        {
            tmpArr[0] = alphabetBoard[x1][(y1 + 4) % 5];
            tmpArr[1] = alphabetBoard[x2][(y2 + 4) % 5];
            console.log(tmpArr);
        }
        else if (y1 === y2) //열이 같은 경우
        {
            tmpArr[0] = alphabetBoard[(x1 + 4) % 5][y1];
            tmpArr[1] = alphabetBoard[(x2 + 4) % 5][y2];
        }
        else //행, 열 모두 다른경우
        {
            tmpArr[0] = alphabetBoard[x2][y1];
            tmpArr[1] = alphabetBoard[x1][y2];
        }

        decPlayFair.push(tmpArr);
    }

    for (let i = 0; i < decPlayFair.length; i++) //중복 문자열 돌려놓음
    {
        if (i != decPlayFair.length - 1 && decPlayFair[i][1] == 'x' && decPlayFair[i][0] == decPlayFair[i + 1][0]) {
            decStr += decPlayFair[i][0];
        }
        else {
            decStr += decPlayFair[i][0] + "" + decPlayFair[i][1];
        }
    }

    for (let i = 0; i < zChk.length; i++)//z위치 찾아서 q로 돌려놓음
    {
        if (zChk.charAt(i) == '1') {
            decStr = decStr.substring(0, i) + 'z' + decStr.substring(i + 1, decStr.length);
        }
    }
    if(decStr.slice(decStr.length-1,decStr.length) === 'x'){
        decStr = decStr.slice(0,length-1);
    }
    dec.value = decStr;
}