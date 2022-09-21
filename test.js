let json = '{"latitude": -27.4956398,"longitude": 153.0045166,"date": "08/23/2022","time": "16:59:10"}';

let data = JSON.parse(json);
let latitude = data["latitude"];
let longitutde = data["longitude"];
let timestamp = data["time"];
let str = 'insert into iot values(';
let t = str + latitude;
let str1 = ',';
let t3 = t + str1 + longitutde;
let t5 = t3 + '\,\'' + timestamp;
let t2 = '\')';
let t4 = t5 + t2;

console.log(t4);